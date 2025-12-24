import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireTournamentContext(routeCode) {
  const cookieStore = await cookies(); // ✅
  const cookieCode = cookieStore.get("tournament_code")?.value;
  const tournamentId = cookieStore.get("tournament_id")?.value;

  if (!tournamentId || cookieCode !== routeCode) {
    redirect("/");
  }

  return {
    tournamentId: Number(tournamentId),
    code: cookieCode,
  };
}
