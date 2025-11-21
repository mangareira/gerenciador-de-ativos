import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DatePickerProps } from '@/types/data-picker-props';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';


export const DatePicker = ({ disable, onChange, value }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
          disabled={disable}
          variant={'outline'}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? (
            format(value, 'PPP', { locale: ptBR })
          ) : (
            <span>Escolha uma data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          initialFocus
          disabled={disable}
          locale={ptBR}
          mode="single"
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
};
