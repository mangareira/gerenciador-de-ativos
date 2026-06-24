import { Tickets } from '@/components/ticket'
import { headers } from 'next/headers'

export default async function TicketsPage() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')

  return <Tickets userId={userId} />
}