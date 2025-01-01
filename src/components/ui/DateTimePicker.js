"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scrollarea";

function DateTimePicker({ value, onChange, name }) {
  const [date, setDate] = React.useState(value); // Initialize with value prop

  React.useEffect(() => {
    // Update the internal state when the parent changes the value
    setDate(value);
  }, [value]);

  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate); // Call onChange prop to notify parent
    }
  };

  const handleTimeChange = (type, value) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === "PM" ? currentHours + 12 : currentHours - 12
        );
      }
      setDate(newDate);
      onChange(newDate); // Call onChange prop to notify parent
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-medium text-gray-700 bg-white shadow-md hover:bg-gray-100 rounded-lg transition-colors duration-300",
            !date && "text-muted-foreground"
          )}
          data-name={name} // Attach the name as a data attribute
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-primary-500" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span className="text-muted">MM/DD/YYYY hh:mm aa</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 rounded-lg bg-white shadow-lg">
        <div className="sm:flex space-x-4">
          <div className="w-full sm:w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x rounded-lg overflow-hidden shadow-md">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square hover:bg-primary-100"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square hover:bg-primary-100"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-24 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square hover:bg-primary-100"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <input
          type="hidden"
          name={name}
          value={date ? date.toISOString() : ""}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DateTimePicker;
