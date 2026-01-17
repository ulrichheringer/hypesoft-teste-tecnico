"use client";

import type { ChangeEvent, FocusEvent } from "react";
import { useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CurrencyInputProps = {
  id?: string;
  value: number;
  onValueChange: (value: number) => void;
  locale?: string;
  currency?: string;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
};

export function CurrencyInput({
  id,
  value,
  onValueChange,
  locale = "pt-BR",
  currency = "BRL",
  placeholder,
  className,
  onBlur,
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { formatter, symbol, decimal, group } = useMemo(() => {
    const nextFormatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const parts = nextFormatter.formatToParts(1234.5);
    return {
      formatter: nextFormatter,
      symbol: parts.find((part) => part.type === "currency")?.value ?? "R$",
      decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
      group: parts.find((part) => part.type === "group")?.value ?? ",",
    };
  }, [currency, locale]);

  const displayValue = useMemo(() => {
    const parts = formatter.formatToParts(value);
    return parts
      .filter((part) => part.type !== "currency")
      .map((part) => part.value)
      .join("")
      .replace(/\u00a0/g, " ")
      .trim();
  }, [formatter, value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const normalized = raw
      .replace(/\s/g, "")
      .replace(new RegExp(`\\${group}`, "g"), "")
      .replace(decimal, ".")
      .replace(/[^0-9.]/g, "");

    const parsed = Number.parseFloat(normalized);
    onValueChange(Number.isNaN(parsed) ? 0 : parsed);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        const end = inputRef.current.value.length;
        inputRef.current.setSelectionRange(end, end);
      }
    });
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {symbol}
      </span>
      <Input
        ref={inputRef}
        id={id}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        inputMode="decimal"
        className={cn("pl-10 text-right tabular-nums", className)}
      />
    </div>
  );
}
