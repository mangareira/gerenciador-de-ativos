import { LayoutDashboard, Package, FileKey, FileText, Ticket, BarChart3, Users, Settings } from "lucide-react";

export const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Ativos", href: "/assets", icon: Package },
  { name: "Licenças", href: "/licenses", icon: FileKey },
  { name: "Contratos", href: "/contracts", icon: FileText },
  { name: "Chamados", href: "/tickets", icon: Ticket },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
  { name: "Usuários", href: "/users", icon: Users },
  { name: "Configurações", href: "/settings", icon: Settings },
]