'use client';
import { cn, getRoleBadgeColor, getRoleLabel } from "@/lib/utils";
import { ChevronLeft, LogOut, Package } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { navigation } from "@/utils/constants/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useGetUser } from "@/utils/hooks/user/useGetUser";

export function Sidebar({ userId }: { userId: string }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: user, isPending } = useGetUser({ id: userId });

  return (
    <div className={cn("flex h-screen flex-col border-r bg-card transition-all duration-300", isMenuOpen ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isMenuOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Ativos</span>
          </div>
        )}
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <ChevronLeft className={cn("h-4 w-4 transition-transform", isMenuOpen ? "rotate-180" : "rotate-0")} />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href + '/'));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isMenuOpen && "justify-center")}
              title={isMenuOpen ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isMenuOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          )
        })}
      </nav>
      {
        user && !isPending ? (
          <div className="border-t p-4">
            <div className={cn("flex items-center gap-3", isMenuOpen && "justify-center")}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar || ''} alt={user.name || 'Avatar'} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {!isMenuOpen && (
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <Badge variant="outline" className={cn("text-xs mt-0.5", getRoleBadgeColor(user.role))}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              )}
            </div>
            {!isMenuOpen && (
              <Button variant="ghost" className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            )}
            {isMenuOpen && (
              <Button variant="ghost" size="icon" className="mt-2 w-full text-muted-foreground hover:text-foreground" title="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Carregando...</span>
          </div>
        )
      }
    </div>
  )
}
