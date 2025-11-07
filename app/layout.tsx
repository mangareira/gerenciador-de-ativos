import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { ModeToggle } from "@/components/modeToggle";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed right-4 top-4 z-50">
            <ModeToggle />
          </div>
          <Sidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
