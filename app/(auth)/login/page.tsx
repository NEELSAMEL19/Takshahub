import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ENDPOINTS } from "@/service/routes"; // 🟩 Removed API_BASE_URL import
import AuthDesign from "../../../components/Base/AuthDesign/AuthDesign";
import { LoginForm } from "@/features/auth/components";

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = await fetch(`${appUrl}${API_ENDPOINTS.AUTH.ME}`, {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function LoginPage() {
  const me = await getMe();

  const role = me?.data?.auth?.role;

  if (!role) {
    return (
      <div className="w-full h-screen flex justify-between">
        <div className="hidden min-[850px]:block min-[850px]:w-1/2 theme-primary-background">
          <AuthDesign />
        </div>

        <div className="w-full h-full flex justify-center pt-12 items-center theme-secondary-background">
          <LoginForm />
        </div>
      </div>
    );
  }

  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");
  return redirect("/student");
}
