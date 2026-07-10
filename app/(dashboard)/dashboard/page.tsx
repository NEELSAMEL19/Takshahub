import { cookies } from "next/headers";
import { redirect } from "next/navigation";
<<<<<<< Updated upstream
import { API_BASE_URL, API_ENDPOINTS } from "@/service/routes";

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
    headers: {
      Cookie: `token=${token}`,
=======

async function getMe() {
  const cookieStore = await cookies(); // ✅ IMPORTANT FIX

  const token = cookieStore.get("token")?.value;

  const res = await fetch("http://localhost:3030/me", {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
>>>>>>> Stashed changes
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

<<<<<<< Updated upstream
export default async function RootPage() {
  const me = await getMe();
  const role = me?.data?.auth?.role;

  if (!role) {
    redirect("/login");
  }
=======
export default async function Page() {
  const me = await getMe();

  const role = me?.data?.auth?.role;
>>>>>>> Stashed changes

  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");
  if (role === "STUDENT") redirect("/student");

  redirect("/login");
}
