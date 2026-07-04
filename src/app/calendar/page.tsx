import { redirect } from "next/navigation";
export default function CalendarRedirect() {
  redirect("/"); // calendar now lives on the dashboard
}
