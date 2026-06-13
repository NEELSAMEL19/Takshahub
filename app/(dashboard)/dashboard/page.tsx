import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getMe() {
  const cookieStore = await cookies(); // ✅ IMPORTANT FIX

  const token = cookieStore.get("token")?.value;

  const res = await fetch("http://localhost:3030/me", {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function Page() {
  const me = await getMe();

  const role = me?.data?.auth?.role;

  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");
  if (role === "STUDENT") redirect("/student");

  redirect("/login");
}
