'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchAssetsProps {
  onSearchChange?: (search: string) => void;
  onTypeChange?: (type: string) => void;
  onStatusChange?: (status: string) => void;
}

export default function SearchAssets({ 
  onSearchChange, 
  onTypeChange, 
  onStatusChange 
}: SearchAssetsProps) {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length >= 3 || searchInput.length === 0) {
        onSearchChange?.(searchInput);
      }
    }, 300); // 300ms delay for debounce

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, modelo, serial..." 
              className="pl-9" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select defaultValue="all" onValueChange={onTypeChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="laptop">Notebooks</SelectItem>
              <SelectItem value="desktop">Desktops</SelectItem>
              <SelectItem value="server">Servidores</SelectItem>
              <SelectItem value="network">Rede</SelectItem>
              <SelectItem value="mobile">Móveis</SelectItem>
              <SelectItem value="printer">Impressoras</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={onStatusChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="in_use">Em Uso</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="retired">Aposentado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Mais Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
