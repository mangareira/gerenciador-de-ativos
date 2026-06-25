import { TicketDetails } from "@/components/ticket/ticketsDetails";
import { UserRole } from "@/utils/schemas/enums.schemas";
import { headers } from "next/headers";

export default async function TicketDetailsPage() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')
  const userRole = headersList.get('x-user-role') as UserRole

  return (
    <TicketDetails userId={userId!} userRole={userRole!} />
  )
}
