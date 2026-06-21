import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "@/service/routes";

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function RootPage() {
  const me = await getMe();
  const role = me?.data?.auth?.role;

  if (!role) {
    redirect("/login");
  }

  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");
  if (role === "STUDENT") redirect("/student");

  redirect("/login");
}
