//+------------------------------------------------------------------+
//| TradeEdgeSync.mq5                                                 |
//| Sends every CLOSED trade to your TradeEdge journal automatically. |
//|                                                                   |
//| SETUP (one time):                                                 |
//| 1) MT5 → Tools → Options → Expert Advisors →                      |
//|      ✔ "Allow WebRequest for listed URL" and add your site, e.g.  |
//|      https://your-app.vercel.app                                  |
//| 2) Drag this EA onto ANY chart. In its Inputs fill:               |
//|      WebhookURL  = https://your-app.vercel.app/api/mt5            |
//|      SecretKey   = the same value you set as MT5_SYNC_SECRET      |
//|      UserId      = your TradeEdge user id (Settings page)         |
//|      AccountId   = the TradeEdge account id (Settings page)       |
//| 3) Keep "Algo Trading" enabled. Done — every trade you close      |
//|    appears in TradeEdge. On start it also backfills recent        |
//|    history (duplicates are ignored server-side).                  |
//+------------------------------------------------------------------+
#property copyright "TradeEdge"
#property version   "1.00"
#property strict

input string WebhookURL   = "https://your-app.vercel.app/api/mt5";
input string SecretKey    = "";
input string UserId       = "";   // TradeEdge → Settings → MT5 Sync
input string AccountId    = "";   // TradeEdge → Settings → MT5 Sync
input int    BackfillDays = 30;   // history to sync on start (0 = off)

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
bool SendDeals(string dealsJsonArray, int count)
{
   if(count == 0) return true;
   string body = "{";
   body += "\"login\":" + (string)AccountInfoInteger(ACCOUNT_LOGIN) + ",";
   body += "\"userId\":\"" + UserId + "\",";
   body += "\"accountId\":\"" + AccountId + "\",";
   body += "\"deals\":[" + dealsJsonArray + "]}";

   char post[]; char result[];
   StringToCharArray(body, post, 0, StringLen(body), CP_UTF8);
   string headers = "Content-Type: application/json\r\nx-sync-key: " + SecretKey + "\r\n";
   string resultHeaders;
   ResetLastError();
   int status = WebRequest("POST", WebhookURL, headers, 8000, post, result, resultHeaders);
   if(status == -1)
   {
      Print("TradeEdgeSync: WebRequest failed (", GetLastError(),
            "). Add the site under Tools → Options → Expert Advisors → Allow WebRequest.");
      return false;
   }
   string resp = CharArrayToString(result, 0, WHOLE_ARRAY, CP_UTF8);
   Print("TradeEdgeSync: sent ", count, " deal(s) → HTTP ", status, " ", resp);
   return (status >= 200 && status < 300);
}

//+------------------------------------------------------------------+
int OnInit()
{
   if(StringLen(SecretKey) == 0 || StringLen(UserId) == 0 || StringLen(AccountId) == 0)
   {
      Print("TradeEdgeSync: fill in SecretKey, UserId and AccountId in the EA inputs.");
      return(INIT_SUCCEEDED);
   }
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
