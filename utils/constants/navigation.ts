import { LayoutDashboard, Package, FileKey, FileText, Ticket, BarChart3, Users, Settings } from "lucide-react";

export const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin", "manager", "technician"] },
  { name: "Ativos", href: "/assets", icon: Package, roles: ["admin", "manager", "technician"] },
  { name: "Licenças", href: "/licenses", icon: FileKey, roles: ["admin", "manager", "technician"] },
  { name: "Contratos", href: "/contracts", icon: FileText, roles: ["admin", "manager", "technician"] },
  { name: "Chamados", href: "/tickets", icon: Ticket, roles: ["admin", "manager", "technician", "user"] },
  { name: "Relatórios", href: "/reports", icon: BarChart3, roles: ["admin", "manager"] },
  { name: "Usuários", href: "/users", icon: Users, roles: ["admin"] },
  { name: "Configurações", href: "/settings", icon: Settings, roles: ["admin", "manager", "user", "technician"] },
]