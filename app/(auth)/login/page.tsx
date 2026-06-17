import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components";
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

export default async function LoginPage() {
  const me = await getMe();

  const role = me?.data?.auth?.role;

  // 🔥 If user is NOT logged in → show login page
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Takshahub</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <LoginForm />
        </div>
      </div>
    );
  }

  // 🔥 If logged in → redirect by role
  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");

  return redirect("/student");
}
