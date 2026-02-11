"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFireStore } from "@/store/fireStore";

export function TimePicker({ setNewDate }) {
  const { theme, textTheme } = useFireStore();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, newTime] = useState("");

  useEffect(() => {
    if (date) {
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.slice(0, 2),
        time.slice(3, 5),
        time.slice(6, 8),
      );
      setNewDate(newDate);
    }
  }, [time, date]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <label htmlFor="date-picker" className="px-1">
          DATE
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              style={{
                backgroundColor: theme,
                color: textTheme,
                border: `1px solid ${textTheme}`,
              }}
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              className="bg-black!"
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="time-picker" className="px-1">
          TIME
        </label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          style={{
            backgroundColor: theme,
            color: textTheme,
            border: `1px solid ${textTheme}`,
          }}
          onChange={(e) => newTime(e.currentTarget.value)}
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
