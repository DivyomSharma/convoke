"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomSelect({
  name,
  options,
  required,
  defaultValue,
}: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || (options.length > 0 ? options[0].value : ""));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input type="hidden" name={name} value={value} required={required} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-full items-center justify-between rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none transition hover:border-bronze/40 focus:border-bronze"
      >
        <span className={value ? "text-foreground" : "text-muted"}>
          {selectedOption ? selectedOption.label : "Select an option..."}
        </span>
        <ChevronDown className={`size-4 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-[8px] border border-line bg-[#0a0a0a] shadow-xl"
          >
            <div className="max-h-60 overflow-y-auto p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setValue(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center rounded-[6px] px-3 py-2.5 text-left text-sm transition-colors ${
                    value === option.value
                      ? "bg-bronze/10 text-bronze font-medium"
                      : "text-foreground hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
