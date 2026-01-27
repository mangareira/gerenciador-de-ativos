'use client';

import { SelectProps } from '@/types/select-props';
import { useMemo } from 'react';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Select = ({
  onChange,
  disable,
  onCreate,
  options = [],
  placeholder,
  value,
  className
}: SelectProps) => {
  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value)?.value || '';
  }, [options, value]);

  const handleChange = (newValue: string) => {
    onChange(newValue === '' ? undefined : newValue);
  };

  return (
    <ShadcnSelect
      value={formattedValue}
      onValueChange={handleChange}
      disabled={disable}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {onCreate && (
          <SelectItem
            value="__create__"
            onClick={() => {
              const newValue = prompt('Digite o novo valor:');
              if (newValue) onCreate(newValue);
            }}
          >
            + Criar novo
          </SelectItem>
        )}
      </SelectContent>
    </ShadcnSelect>
  );
};