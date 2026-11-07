//+------------------------------------------------------------------+
//| TradeEdgeSync.mq5                                                 |
//| Sends every CLOSED trade to your TradeEdge journal automatically. |
//|                                                                   |
//| EASY SETUP: in TradeEdge open Accounts → Add account → Connect   |
//| MT5, download the EA from there (it already contains your site    |
//| address and link token), then:                                    |
//| 1) Put it in MT5 → File → Open Data Folder → MQL5/Experts,        |
//|    compile it in MetaEditor (F7).                                 |
//| 2) MT5 → Tools → Options → Expert Advisors → tick                 |
//|    "Allow WebRequest for listed URL" and add your site address.   |
//| 3) Drag the EA onto ANY chart and keep "Algo Trading" on.         |
//|                                                                   |
//| The EA pings TradeEdge every minute (so the app shows            |
//| "Connected") and sends every closed trade; on start it also      |
//| backfills recent history (duplicates are ignored server-side).    |
//|                                                                   |
//| Legacy mode (no LinkToken): fill SecretKey, UserId, AccountId.    |
//+------------------------------------------------------------------+
#property copyright "TradeEdge"
#property version   "2.00"
#property strict

input string WebhookURL   = "https://your-app.vercel.app/api/mt5";
input string LinkToken    = "";   // pre-filled when downloaded from TradeEdge → Connect MT5
input string SecretKey    = "";   // legacy mode only
input string UserId       = "";   // legacy mode only
input string AccountId    = "";   // legacy mode only
input int    BackfillDays = 30;   // history to sync on start (0 = off)

bool UsingToken() { return StringLen(LinkToken) > 0; }
bool Configured() { return UsingToken() || (StringLen(SecretKey) > 0 && StringLen(UserId) > 0 && StringLen(AccountId) > 0); }
string SyncKey()  { return UsingToken() ? LinkToken : SecretKey; }

//+------------------------------------------------------------------+
datetime GmtOffset() { return (TimeTradeServer() - TimeGMT()); }

string IsoUtc(datetime serverTime)
{
   datetime utc = serverTime - GmtOffset();
   MqlDateTime t; TimeToStruct(utc, t);
   return StringFormat("%04d-%02d-%02dT%02d:%02d:%02dZ", t.year, t.mon, t.day, t.hour, t.min, t.sec);
}

string Num(double v, int digits = 5)
{
   if(v == 0) return "0";
   return DoubleToString(v, digits);
}

//+------------------------------------------------------------------+
//| Build one deal's JSON from a CLOSING deal ticket                  |
//+------------------------------------------------------------------+
string DealJson(ulong dealTicket)
{
   long   entryType = HistoryDealGetInteger(dealTicket, DEAL_ENTRY);
   if(entryType != DEAL_ENTRY_OUT && entryType != DEAL_ENTRY_OUT_BY) return "";

   long   posId   = HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID);
   string symbol  = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
   double exitPx  = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
   double volume  = HistoryDealGetDouble(dealTicket, DEAL_VOLUME);
   double sl      = HistoryDealGetDouble(dealTicket, DEAL_SL);
   double tp      = HistoryDealGetDouble(dealTicket, DEAL_TP);
   double profit  = HistoryDealGetDouble(dealTicket, DEAL_PROFIT)
                  + HistoryDealGetDouble(dealTicket, DEAL_SWAP)
                  + HistoryDealGetDouble(dealTicket, DEAL_COMMISSION);

   // find the opening deal of this position for entry price/time/direction
   double entryPx = 0; datetime openTime = (datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME);
   string direction = "long";
   if(HistorySelectByPosition(posId))
   {
      int n = HistoryDealsTotal();
      for(int i = 0; i < n; i++)
      {
         ulong dt = HistoryDealGetTicket(i);
         if(HistoryDealGetInteger(dt, DEAL_ENTRY) == DEAL_ENTRY_IN)
         {
            entryPx  = HistoryDealGetDouble(dt, DEAL_PRICE);
            openTime = (datetime)HistoryDealGetInteger(dt, DEAL_TIME);
            profit  += HistoryDealGetDouble(dt, DEAL_COMMISSION);
            direction = (HistoryDealGetInteger(dt, DEAL_TYPE) == DEAL_TYPE_BUY) ? "long" : "short";
            break;
         }
      }
   }

   string json = "{";
   json += "\"ticket\":" + (string)dealTicket + ",";
   json += "\"symbol\":\"" + symbol + "\",";
   json += "\"direction\":\"" + direction + "\",";
   json += "\"openTimeUtc\":\"" + IsoUtc(openTime) + "\",";
   if(entryPx > 0) json += "\"entry\":" + Num(entryPx) + ",";
   json += "\"exit\":" + Num(exitPx) + ",";
   if(sl > 0) json += "\"stopLoss\":" + Num(sl) + ",";
   if(tp > 0) json += "\"takeProfit\":" + Num(tp) + ",";
   json += "\"volume\":" + Num(volume, 2) + ",";
   json += "\"profit\":" + DoubleToString(profit, 2);
   json += "}";
   return json;
}

//+------------------------------------------------------------------+
bool Post(string body, bool isDeals, int count)
{
   char post[]; char result[];
   StringToCharArray(body, post, 0, StringLen(body), CP_UTF8);
   string headers = "Content-Type: application/json\r\nx-sync-key: " + SyncKey() + "\r\n";
   string resultHeaders;
   ResetLastError();
   int status = WebRequest("POST", WebhookURL, headers, 8000, post, result, resultHeaders);
   if(status == -1)
   {
      Print("TradeEdgeSync: WebRequest failed (", GetLastError(),
            "). Add your site under Tools → Options → Expert Advisors → Allow WebRequest.");
      return false;
   }
   string resp = CharArrayToString(result, 0, WHOLE_ARRAY, CP_UTF8);
   if(isDeals)
      Print("TradeEdgeSync: sent ", count, " deal(s) → HTTP ", status, " ", resp);
   else if(status < 200 || status >= 300)
      Print("TradeEdgeSync: heartbeat → HTTP ", status, " ", resp);
   return (status >= 200 && status < 300);
}

bool SendDeals(string dealsJsonArray, int count)
{
   if(count == 0) return true;
   string body = "{";
   body += "\"login\":" + (string)AccountInfoInteger(ACCOUNT_LOGIN) + ",";
   if(!UsingToken())
   {
      body += "\"userId\":\"" + UserId + "\",";
      body += "\"accountId\":\"" + AccountId + "\",";
   }
   body += "\"deals\":[" + dealsJsonArray + "]}";
   return Post(body, true, count);
}

// Lets TradeEdge show "Connected" even before your first trade closes.
void SendHeartbeat()
{
   if(!UsingToken()) return;
   string server = AccountInfoString(ACCOUNT_SERVER);
   StringReplace(server, "\"", "");
   string body = "{\"heartbeat\":true,\"login\":" + (string)AccountInfoInteger(ACCOUNT_LOGIN) +
                 ",\"server\":\"" + server + "\",\"balance\":" + DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE), 2) + "}";
   Post(body, false, 0);
}

//+------------------------------------------------------------------+
int OnInit()
{
   if(!Configured())
   {
      Print("TradeEdgeSync: set LinkToken (download the EA from TradeEdge → Connect MT5), or fill SecretKey, UserId and AccountId.");
      return(INIT_SUCCEEDED);
   }
   EventSetTimer(60);
   SendHeartbeat();
   if(BackfillDays > 0)
   {
      datetime from = TimeCurrent() - BackfillDays * 86400;
      if(HistorySelect(from, TimeCurrent()))
      {
         string batch = ""; int count = 0;
         int total = HistoryDealsTotal();
         for(int i = 0; i < total; i++)
         {
            ulong ticket = HistoryDealGetTicket(i);
            string j = DealJson(ticket);
            // DealJson uses HistorySelectByPosition which resets the selection —
            // reselect the window before continuing the loop.
            HistorySelect(from, TimeCurrent());
            if(StringLen(j) == 0) continue;
            if(count > 0) batch += ",";
            batch += j; count++;
            if(count >= 50) { SendDeals(batch, count); batch = ""; count = 0; HistorySelect(from, TimeCurrent()); }
         }
         SendDeals(batch, count);
         Print("TradeEdgeSync: backfill complete.");
      }
   }
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
void OnTimer() { SendHeartbeat(); }

void OnDeinit(const int reason) { EventKillTimer(); }

//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans, const MqlTradeRequest &request, const MqlTradeResult &result)
{
   if(trans.type != TRADE_TRANSACTION_DEAL_ADD) return;
   if(!HistoryDealSelect(trans.deal)) return;
   long entryType = HistoryDealGetInteger(trans.deal, DEAL_ENTRY);
   if(entryType != DEAL_ENTRY_OUT && entryType != DEAL_ENTRY_OUT_BY) return;
   string j = DealJson(trans.deal);
   if(StringLen(j) > 0) SendDeals(j, 1);
}
//+------------------------------------------------------------------+
