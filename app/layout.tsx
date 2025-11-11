import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/Header";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IT Asset Manager - Sistema de Gerenciamento de Ativos",
  description: "Sistema completo para gerenciamento de ativos e serviços de TI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased flex h-screen overflow-hidden`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
