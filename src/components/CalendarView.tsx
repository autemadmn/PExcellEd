import { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import type { ComparedRow } from '../types/comparison';
import { addDays } from '../utils/dateUtils';
import { EmptyState } from './EmptyState';
import { EventDetailModal } from './EventDetailModal';

interface CalendarViewProps {
  rows: ComparedRow[];
}

function eventColorForRow(row: ComparedRow): { backgroundColor: string; borderColor: string; textColor: string } {
  if (row.changedFields.length > 0) {
    return { backgroundColor: '#D97706', borderColor: '#B45309', textColor: '#FFFFFF' };
  }

  if (row.status === 'unmatched') {
    return { backgroundColor: '#EEF3F8', borderColor: '#9CADBF', textColor: '#10263F' };
  }

  return { backgroundColor: '#244A70', borderColor: '#173452', textColor: '#FFFFFF' };
}

function eventDatesForRow(row: ComparedRow): Pick<EventInput, 'start' | 'end'> | null {
  const { startDate, endDate } = row.currentRow;

  if (startDate && endDate) {
    return {
      start: startDate,
      end: startDate === endDate ? undefined : addDays(endDate, 1),
    };
  }

  if (startDate) {
    return { start: startDate };
  }

  if (endDate) {
    return { start: endDate };
  }

  return null;
}

export function CalendarView({ rows }: CalendarViewProps) {
  const [selectedRow, setSelectedRow] = useState<ComparedRow | null>(null);

  const events = useMemo<EventInput[]>(() => {
    return rows.flatMap((row, index) => {
      const dates = eventDatesForRow(row);
      if (!dates) {
        return [];
      }

      const colors = eventColorForRow(row);
      const taskName = row.currentRow.taskName.trim() || 'Sin nombre';
      const assignee = row.currentRow.assignee.trim() || 'Sin asignar';

      return [
        {
          id: String(index),
          title: taskName,
          allDay: true,
          extendedProps: { row, assignee },
          ...dates,
          ...colors,
        },
      ];
    });
  }, [rows]);

  if (events.length === 0) {
    return (
      <EmptyState
        title="No hay tareas con fechas válidas"
        description="Las filas filtradas no tienen fecha de inicio ni de finalización para mostrar en calendario."
      />
    );
  }

  const handleEventClick = (eventClick: EventClickArg): void => {
    const row = eventClick.event.extendedProps.row as ComparedRow | undefined;
    if (row) {
      setSelectedRow(row);
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const assignee =
      typeof eventInfo.event.extendedProps.assignee === 'string'
        ? eventInfo.event.extendedProps.assignee
        : 'Sin asignar';

    return (
      <div className="calendar-event-content">
        <span className="calendar-event-title">{eventInfo.event.title}</span>
        <span className="calendar-event-assignee">Asignado a: {assignee}</span>
      </div>
    );
  };

  return (
    <section className="calendar-panel">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
        }}
        locale="es"
        firstDay={1}
        height="auto"
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />
      {selectedRow && <EventDetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />}
    </section>
  );
}
