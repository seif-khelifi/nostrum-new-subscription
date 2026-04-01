"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { GeoPFResult } from "@/lib/geo";

const DEBOUNCE_MS = 300;

/* ─── Props ─── */

export interface AddressSearchInputProps {
  /** Currently selected fulltext (controlled by parent form) */
  selected: string;
  /** Called when user selects a suggestion */
  onSelect: (fulltext: string) => void;
  /** Called when user clears selection by typing */
  onClear: () => void;
  /** Called when the API fetch fails or returns an error */
  onError?: () => void;
  placeholder?: string;
  /** Extra class names for the outer wrapper */
  wrapperClassName?: string;
}

/* ─── Component ─── */

export function AddressSearchInput({
  selected,
  onSelect,
  onClear,
  onError,
  placeholder = "Rechercher une adresse...",
  wrapperClassName,
}: AddressSearchInputProps) {
  const [query, setQuery] = useState(selected);
  const [suggestions, setSuggestions] = useState<GeoPFResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const skipFetchRef = useRef(false);

  const fetchSuggestions = useCallback(
    async (text: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const params = new URLSearchParams({ text });
        const res = await fetch(`/api/searchBAN?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          if (!controller.signal.aborted) {
            setSuggestions([]);
            onError?.();
          }
          return;
        }
        const data = await res.json();
        if (data.error) {
          if (!controller.signal.aborted) {
            setSuggestions([]);
            onError?.();
          }
          return;
        }
        setSuggestions(data.results ?? []);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          onError?.();
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [onError],
  );

  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => fetchSuggestions(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selected) onClear();
  };

  const handleSelect = (addr: GeoPFResult) => {
    onSelect(addr.fulltext);
    skipFetchRef.current = true;
    setQuery(addr.fulltext);
    setSuggestions([]);
  };

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {/* Input bar */}
      <div
        data-slot="search-input"
        className={cn(
          "flex w-full items-center overflow-hidden rounded-xl",
          "focus-within:ring-[3px] focus-within:ring-[#490076]/20",
          "transition-shadow duration-200 ease-out",
        )}
      >
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "flex-1 h-12 px-4",
            "rounded-none rounded-l-xl",
            "bg-[#F3E5FA] text-[#490076]",
            "placeholder:text-[#490076]/50",
            "text-[15px] font-medium",
            "border-0 shadow-none outline-none",
            "focus-visible:ring-0",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Rechercher"
          onClick={() => query.trim().length >= 3 && fetchSuggestions(query)}
          className={cn(
            "h-12 w-12 shrink-0",
            "rounded-none rounded-r-xl",
            "bg-[#490076] text-white",
            "inline-flex items-center justify-center",
            "hover:bg-[#5a0a8f]",
            "active:translate-y-px",
            "transition-colors duration-200 ease-out",
            "outline-none",
          )}
        >
          {loading ? (
            <Spinner className="size-5" />
          ) : (
            <Search className="size-5" />
          )}
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.map((addr, i) => (
        <Button
          key={`${addr.fulltext}-${i}`}
          type="button"
          variant="selectOption"
          size="select"
          selected={selected === addr.fulltext}
          onClick={() => handleSelect(addr)}
          className="justify-between max-w-[calc(100vw-2rem)] sm:max-w-none whitespace-normal text-left h-auto min-h-10 sm:min-h-12 py-2.5"
        >
          <span className="min-w-0">{addr.fulltext}</span>
          {selected === addr.fulltext && (
            <span className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#490076] text-white">
              <Check className="size-3 sm:size-3.5" />
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Basic SearchInput — simple text input with search icon            */
/* ═══════════════════════════════════════════════════════════════════ */

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  wrapperClassName?: string;
  onSearch?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, onSearch, ...props }, ref) => {
    return (
      <div
        data-slot="search-input"
        className={cn(
          "flex w-full items-center overflow-hidden rounded-xl",
          "focus-within:ring-[3px] focus-within:ring-[#490076]/20",
          "transition-shadow duration-200 ease-out",
          wrapperClassName,
        )}
      >
        <input
          ref={ref}
          type="text"
          className={cn(
            "flex-1 h-12 px-4",
            "rounded-none rounded-l-xl",
            "bg-[#F3E5FA] text-[#490076]",
            "placeholder:text-[#490076]/50",
            "text-[15px] font-medium",
            "border-0 shadow-none outline-none",
            "focus-visible:ring-0",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Rechercher"
          onClick={onSearch}
          className={cn(
            "h-12 w-12 shrink-0",
            "rounded-none rounded-r-xl",
            "bg-[#490076] text-white",
            "inline-flex items-center justify-center",
            "hover:bg-[#5a0a8f]",
            "active:translate-y-px",
            "transition-colors duration-200 ease-out",
            "outline-none",
          )}
        >
          <Search className="size-5" />
        </button>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
