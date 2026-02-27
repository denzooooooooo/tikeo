'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  presets?: Array<{ label: string; days: number }>;
}

const PRESETS = [
  { label: 'Aujourd\'hui', days: 0 },
  { label: 'Demain', days: 1 },
  { label: 'Ce week-end', days: 0 },
  { label: 'Cette semaine', days: 7 },
  { label: 'Ce week-end prochain', days: 7 },
  { label: 'Ce mois', days: 30 },
  { label: 'Le mois prochain', days: 60 },
];

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function DateRangePicker({
  value = { start: null, end: null },
  onChange,
  placeholder = 'Sélectionner une période',
  minDate,
  maxDate,
  className = '',
  presets = PRESETS,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDateClick = (date: Date) => {
    if (!value.start || (value.start && value.end)) {
      onChange?.({ start: date, end: null });
    } else {
      if (date < value.start) {
        onChange?.({ start: date, end: value.start });
      } else {
        onChange?.({ start: value.start, end: date });
      }
    }
  };

  const handlePresetClick = (days: number) => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    
    if (days === 0) {
      // Today or this weekend
      start.setDate(today.getDate());
      end.setDate(today.getDate() + (today.getDay() === 0 ? 0 : 6 - today.getDay()));
    } else if (days === 1) {
      start.setDate(today.getDate() + 1);
      end.setDate(today.getDate() + 1);
    } else if (days === 7) {
      // This week (next 7 days)
      start.setDate(today.getDate());
      end.setDate(today.getDate() + 7);
    } else {
      end.setDate(today.getDate() + days);
    }

    onChange?.({ start, end });
    setIsOpen(false);
  };

  const renderCalendar = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, monthIndex, -i);
      days.push(d);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, monthIndex, i));
    }
    
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, monthIndex + 1, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isInRange = (date: Date) => {
    if (!value.start) return false;
    const start = value.start;
    const end = value.end || hoverDate;
    if (!end) return false;
    return date > start && date < end;
  };

  const isSelected = (date: Date) => {
    return (value.start && date.toDateString() === value.start.toDateString()) ||
           (value.end && date.toDateString() === value.end.toDateString());
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors ${
          isOpen ? 'border-purple-500 ring-2 ring-purple-100' : ''
        }`}
      >
        <Calendar className="h-5 w-5 text-gray-400" />
        <span className={`flex-1 text-left ${value.start ? 'text-gray-900' : 'text-gray-400'}`}>
          {value.start 
            ? `${formatDate(value.start)} ${value.end ? `- ${formatDate(value.end)}` : ''}`
            : placeholder
          }
        </span>
        {value.start && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange?.({ start: null, end: null });
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Presets */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.days)}
                  className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendars */}
          <div className="flex">
            {/* First Month */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="font-semibold text-gray-900">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <div className="w-9" />
              </div>

              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-xs text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {renderCalendar(currentMonth).map((date, index) => {
                  if (!date) return <div key={index} />;
                  const disabled = isDateDisabled(date);
                  const selected = isSelected(date);
                  const inRange = isInRange(date);
                  const today = isToday(date);

                  return (
                    <button
                      key={index}
                      onClick={() => !disabled && handleDateClick(date)}
                      disabled={disabled}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      className={`
                        w-9 h-9 text-sm rounded-lg transition-all relative
                        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-purple-50'}
                        ${selected ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}
                        ${inRange && !selected ? 'bg-purple-100 text-purple-700' : ''}
                        ${today && !selected ? 'ring-1 ring-purple-400' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Second Month */}
            <div className="p-4 border-l border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9" />
                <span className="font-semibold text-gray-900">
                  {MONTHS[(currentMonth.getMonth() + 1) % 12]} {currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear()}
                </span>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-xs text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {renderCalendar(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)).map((date, index) => {
                  if (!date) return <div key={index} />;
                  const disabled = isDateDisabled(date);
                  const selected = isSelected(date);
                  const inRange = isInRange(date);
                  const today = isToday(date);

                  return (
                    <button
                      key={index}
                      onClick={() => !disabled && handleDateClick(date)}
                      disabled={disabled}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      className={`
                        w-9 h-9 text-sm rounded-lg transition-all relative
                        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-purple-50'}
                        ${selected ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}
                        ${inRange && !selected ? 'bg-purple-100 text-purple-700' : ''}
                        ${today && !selected ? 'ring-1 ring-purple-400' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {value.start && (
                  <span className="text-gray-600">
                    {value.end ? `${formatDate(value.start)} - ${formatDate(value.end)}` : `À partir du ${formatDate(value.start)}`}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;

