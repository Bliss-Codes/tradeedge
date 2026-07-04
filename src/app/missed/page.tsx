import { redirect } from "next/navigation";
export default function MissedRedirect() {
  redirect("/journal?tab=Missed"); // missed trades now live in the Journal
}
