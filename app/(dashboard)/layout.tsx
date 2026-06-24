import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userId={userId!} userRole={userRole!} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  );
}
