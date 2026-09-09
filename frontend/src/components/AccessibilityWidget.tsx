"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Type, Contrast } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccessibilityWidget() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    // Load preferences from local storage on mount
    const storedContrast = localStorage.getItem("high-contrast") === "true";
    const storedText = localStorage.getItem("large-text") === "true";
    
    setHighContrast(storedContrast);
    setLargeText(storedText);
    
    if (storedContrast) document.documentElement.classList.add("high-contrast");
    if (storedText) document.documentElement.classList.add("large-text");
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("high-contrast", String(newValue));
    document.documentElement.classList.toggle("high-contrast", newValue);
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    localStorage.setItem("large-text", String(newValue));
    document.documentElement.classList.toggle("large-text", newValue);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-lg border-2 border-primary bg-background hover:bg-muted">
            <Settings className="h-6 w-6" />
            <span className="sr-only">Accessibility Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleHighContrast} className="cursor-pointer justify-between">
            <span className="flex items-center">
              <Contrast className="mr-2 h-4 w-4" />
              High Contrast
            </span>
            {highContrast && <span className="text-green-600 font-bold">ON</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleLargeText} className="cursor-pointer justify-between">
            <span className="flex items-center">
              <Type className="mr-2 h-4 w-4" />
              Large Text
            </span>
            {largeText && <span className="text-green-600 font-bold">ON</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
