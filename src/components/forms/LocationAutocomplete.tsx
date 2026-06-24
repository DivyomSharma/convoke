"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

export function LocationAutocomplete({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [suggestions, setSuggestions] = useState<{ display_name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/location?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        searchLocations(value);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [value, isOpen]);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onBlur={() => setIsOpen(false)}
        placeholder="e.g. Bangalore, India"
        className={className}
        autoComplete="off"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-[100] w-full bg-paper-elevated border border-g3 rounded-xl mt-1 shadow-[0_10px_40px_rgba(0,0,0,0.2)] max-h-60 overflow-auto py-1">
          {suggestions.map((suggestion, i) => (
            <li
              key={i}
              className="px-4 py-2.5 hover:bg-g1 cursor-pointer text-[13px] text-ink border-b border-g3/30 last:border-b-0 flex items-start gap-2.5 transition-colors"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(suggestion.display_name);
                setIsOpen(false);
              }}
            >
              <MapPin size={14} className="shrink-0 mt-0.5 text-[var(--brand)]" />
              <span className="line-clamp-2 leading-[1.4]">{suggestion.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
