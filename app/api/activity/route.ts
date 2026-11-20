import { getCodeActivity } from "@/lib/activity";

/**
 * Latest code activity for the live calendar on the home page.
 * Served from the same cached snapshot as the page (recomputed at most once a minute),
 * so polling never reaches GitLab or GitHub directly.
 */
export async function GET() {
  const activity = await getCodeActivity();
  if (!activity) return Response.json({ error: "Activité indisponible" }, { status: 503 });
  return Response.json(activity);
}
