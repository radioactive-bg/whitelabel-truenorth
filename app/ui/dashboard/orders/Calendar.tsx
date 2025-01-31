'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { FetchInvoicesParams } from '@/app/lib/api/orders';

interface StandaloneCalendarProps {
  fetchOrders: (page: number, filters: FetchInvoicesParams) => void;
  setFilters: (filters: FetchInvoicesParams) => void;
  setCurrentPage: (page: number) => void;
}

const StandaloneCalendar: React.FC<StandaloneCalendarProps> = ({
  fetchOrders,
  setFilters,
  setCurrentPage,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const filters: FetchInvoicesParams = {
        dateFrom: formattedDate,
        dateTo: formattedDate,
        perPage: 10,
        page: 1,
      };

      setFilters(filters);
      setCurrentPage(1);
      fetchOrders(1, filters);
      setSelectedDate(date);
    }
  };

  return (
    <div className="mb-8 flex items-center justify-center bg-background md:justify-start">
      <div className="rounded-lg bg-card p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Calendar</h1>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
      </div>
    </div>
  );
};

export default StandaloneCalendar;
