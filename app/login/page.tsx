import { LoginForm } from "@/components/loginForm";
import { headers } from "next/headers";

export default async function LoginPage() {
  const headersList = await headers();
  const userRole = headersList.get('x-user-role');

  return (
    <LoginForm role={userRole || ''} />
  )
}