import { cookies } from "next/headers";
import { redirect } from "next/navigation";
<<<<<<< Updated upstream
import { API_ENDPOINTS } from "@/service/routes"; // 🟩 Removed API_BASE_URL import
import AuthDesign from "../../../components/Base/AuthDesign/AuthDesign";
=======
>>>>>>> Stashed changes
import { LoginForm } from "@/features/auth/components";
import { API_BASE_URL } from "@/service/routes";

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

<<<<<<< Updated upstream
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = await fetch(`${appUrl}${API_ENDPOINTS.AUTH.ME}`, {
    headers: {
      Cookie: `token=${token}`,
=======
  const res = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
>>>>>>> Stashed changes
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function LoginPage() {
  const me = await getMe();

  const role = me?.data?.auth?.role;

<<<<<<< Updated upstream
  if (!role) {
    return (
      <div className="w-full h-screen flex justify-between">
        <div className="hidden min-[850px]:block min-[850px]:w-1/2 theme-primary-background">
          <AuthDesign />
        </div>

        <div className="w-full h-full flex justify-center pt-12 items-center theme-secondary-background">
=======
  // 🔥 If user is NOT logged in → show login page
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Takshahub</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

>>>>>>> Stashed changes
          <LoginForm />
        </div>
      </div>
    );
  }

<<<<<<< Updated upstream
  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");
=======
  // 🔥 If logged in → redirect by role
  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");

>>>>>>> Stashed changes
  return redirect("/student");
}
