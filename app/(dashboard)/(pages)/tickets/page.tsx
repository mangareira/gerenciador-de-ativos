'use client'

import CreateTicketModal from "@/components/ticket/createTicketModal"
import { FilterTicket } from "@/components/ticket/filter"
import { SummaryTickets } from "@/components/ticket/summary"
import { SummaryTicketsSkeleton } from "@/components/ticket/summary/summaryTicketSkeleton"
import { TicketsTable } from "@/components/ticket/ticketsTable"
import { Button } from "@/components/ui/button"
import { useGetAssets } from "@/utils/hooks/assets/useGetAssets"
import { useGetAllTickets } from "@/utils/hooks/tickets/useGetAllTickets"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

export default function TicketsPage() {
  const [search, setSearch] = useState("")
  const [priority, setPriority] = useState("all")
  const [category, setCategory] = useState("all")
  
  const { data: tickets, isLoading } = useGetAllTickets()
  const { data: assets } = useGetAssets()

  const assetsOptions = (assets ?? []).map((asset) => ({
    label: asset.name,
    value: asset.id
  }))
  
  const filteredTickets = useMemo(() => {
    if (!tickets) return []

    return tickets.filter((t) => {
      // search by title, description, requester name, asset name or id
      const q = search.trim().toLowerCase()
      if (q) {
        const inTitle = t.title.toLowerCase().includes(q)
        const inDesc = t.description.toLowerCase().includes(q)
        const inRequester = t.requester?.name?.toLowerCase().includes(q)
        const inAsset = t.asset?.name?.toLowerCase().includes(q)
        const inId = t.id.toLowerCase().includes(q)
        if (!(inTitle || inDesc || inRequester || inAsset || inId)) return false
      }

      if (priority && priority !== "all" && t.priority !== priority) return false
      if (category && category !== "all" && t.category !== category) return false

      return true
    })
  }, [tickets, search, priority, category])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chamados</h1>
          <p className="text-muted-foreground">Sistema de help desk e gerenciamento de solicitações</p>
        </div>
        <CreateTicketModal 
          triggerButton={(
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Chamado
            </Button>
          )}
          assetsOptions={assetsOptions}
        />
      </div>
      { isLoading && !tickets
        ?
          <SummaryTicketsSkeleton />
        :
          <SummaryTickets tickets={tickets || []} />
      }
      <FilterTicket
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onCategoryChange={setCategory}
      />
      <TicketsTable tickets={filteredTickets} isLoading={isLoading} />
    </div>
  )
}

