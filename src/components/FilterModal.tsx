import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

interface FilterModalProps {
  onFilterChange?: (selectedDate: Date | null) => void;
  trigger?: React.ReactNode;
  currentDate?: Date | null;
}

export function FilterModal({ onFilterChange, trigger, currentDate }: FilterModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentDate || new Date()
  );

  const handleApplyFilter = () => {
    if (selectedDate && onFilterChange) {
      onFilterChange(selectedDate);
    }
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedDate(new Date());
    if (onFilterChange) {
      onFilterChange(null); // Remove o filtro
    }
  };

  const handleClearFilter = () => {
    if (onFilterChange) {
      onFilterChange(null); // Remove o filtro
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-2 sm:px-4">
          <DialogTitle className="text-lg sm:text-xl">Filtrar por Período</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Selecione o período para filtrar os dados do dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 pb-4">
          {/* Seleção de Data com Calendário */}
          <div className="space-y-2 sm:space-y-3">
            <label className="text-sm sm:text-base font-medium">Selecionar Data do Relatório</label>
            <div className="p-2 sm:p-3 border rounded-md bg-muted/50">
              <div className="text-center mb-2 sm:mb-3">
                <div className="text-base sm:text-lg font-semibold">
                  {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {selectedDate ? format(selectedDate, "EEEE", { locale: ptBR }) : ""}
                </div>
              </div>
              
              {/* Calendário Responsivo */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date)}
                  className="rounded-md border-0 w-full max-w-[320px] sm:max-w-[400px]"
                  locale={ptBR}
                  showOutsideDays={true}
                  classNames={{
                    months: "flex flex-col space-y-2 sm:space-y-4",
                    month: "space-y-2 sm:space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-xs sm:text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded text-xs sm:text-sm"
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-7 sm:w-9 font-normal text-[0.7rem] sm:text-[0.8rem]",
                    row: "flex w-full mt-1 sm:mt-2",
                    cell: "h-7 w-7 sm:h-9 sm:w-9 text-center text-xs sm:text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: cn(
                      "h-7 w-7 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded text-xs sm:text-sm"
                    ),
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Presets rápidos */}
          <div className="space-y-2 sm:space-y-3">
            <label className="text-sm sm:text-base font-medium">Datas Rápidas</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => setSelectedDate(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setSelectedDate(yesterday);
                }}
              >
                Ontem
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => {
                  const lastWeek = new Date();
                  lastWeek.setDate(lastWeek.getDate() - 7);
                  setSelectedDate(lastWeek);
                }}
              >
                Há 7 dias
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => {
                  const lastMonth = new Date();
                  lastMonth.setDate(lastMonth.getDate() - 30);
                  setSelectedDate(lastMonth);
                }}
              >
                Há 30 dias
              </Button>
            </div>
          </div>

          {/* Status do filtro atual */}
          {currentDate && (
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs sm:text-sm font-medium text-primary">Data Selecionada</p>
              <p className="text-xs text-muted-foreground">
                {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          )}

          {/* Botões Responsivos */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between">
            <Button 
              variant="outline" 
              onClick={handleClearFilter}
              className="w-full sm:w-auto text-sm"
            >
              Limpar Filtro
            </Button>
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1 sm:flex-none text-sm"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleApplyFilter} 
                disabled={!selectedDate}
                className="flex-1 sm:flex-none text-sm"
              >
                Aplicar Filtro
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
