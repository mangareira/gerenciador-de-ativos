"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Select as ReusableSelect } from "@/components/select";
import { SearchAssetsProps } from "@/types/search-props";

export default function SearchTool({ 
  onSearchChange,
  onTypeChange,
  onStatusChange,
  typeOptions,
  statusOptions,
  typePlaceholder = 'Tipo',
  statusPlaceholder = 'Status',
  debounceMs = 300,
  titlePlaceholder
}: SearchAssetsProps) {
  const [searchInput, setSearchInput] = useState("");

  const defaultType = typeOptions.find((o) => o.value === 'all')?.value ?? typeOptions[0]?.value ?? '';
  const defaultStatus = statusOptions.find((o) => o.value === 'all')?.value ?? statusOptions[0]?.value ?? '';

  const [typeValue, setTypeValue] = useState<string | undefined>(defaultType);
  const [statusValue, setStatusValue] = useState<string | undefined>(defaultStatus);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length >= 3 || searchInput.length === 0) {
        onSearchChange?.(searchInput);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange, debounceMs]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={titlePlaceholder} 
              className="pl-9" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <ReusableSelect
            options={typeOptions}
            placeholder={typePlaceholder}
            onChange={(val) => {
              setTypeValue(val);
              onTypeChange?.(val ?? '');
            }}
            value={typeValue}
            className="w-full md:w-[180px]"
          />

          <ReusableSelect
            options={statusOptions}
            placeholder={statusPlaceholder}
            onChange={(val) => {
              setStatusValue(val);
              onStatusChange?.(val ?? '');
            }}
            value={statusValue}
            className="w-full md:w-[180px]"
          />

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Mais Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
