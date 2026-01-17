"use client";

import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
} from "react";
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
  const maxDigits = 12;

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

  const toDigits = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) {
      return "0";
    }

    const cents = Math.round(Math.abs(nextValue) * 100);
    return cents.toString();
  };

  const toNumber = (digits: string) => {
    const normalized = digits === "" ? "0" : digits;
    return Number.parseInt(normalized, 10) / 100;
  };

  const clampDigits = (digits: string) =>
    digits.length > maxDigits ? digits.slice(0, maxDigits) : digits;

  const setCaretToEnd = () => {
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      const end = input.value.length;
      input.setSelectionRange(end, end);
    });
  };

  const digits = toDigits(value);
  const numericValue = toNumber(digits);

  const displayValue = useMemo(() => {
    const parts = formatter.formatToParts(numericValue);
    return parts
      .filter((part) => part.type !== "currency")
      .map((part) => part.value)
      .join("")
      .replace(/\u00a0/g, " ")
      .trim();
  }, [formatter, numericValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const normalized = raw
      .replace(/\s/g, "")
      .replace(new RegExp(`\\${group}`, "g"), "")
      .replace(decimal, "")
      .replace(/\D/g, "");

    const nextDigits = clampDigits(normalized.replace(/^0+(?=\d)/, ""));
    onValueChange(toNumber(nextDigits));
    setCaretToEnd();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key >= "0" && event.key <= "9") {
      event.preventDefault();
      const nextDigits = clampDigits(digits === "0" ? event.key : `${digits}${event.key}`);
      onValueChange(toNumber(nextDigits));
      setCaretToEnd();
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      const nextDigits = digits.length <= 1 ? "0" : digits.slice(0, -1);
      onValueChange(toNumber(nextDigits));
      setCaretToEnd();
      return;
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "Home" ||
      event.key === "End" ||
      event.key === "Tab"
    ) {
      return;
    }

    event.preventDefault();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) {
      return;
    }
    const base = digits === "0" ? "" : digits;
    const nextDigits = clampDigits(`${base}${pasted}`);
    onValueChange(toNumber(nextDigits));
    setCaretToEnd();
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const end = input.value.length;
    input.setSelectionRange(end, end);
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
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        inputMode="decimal"
        className={cn("pl-10 text-right tabular-nums", className)}
      />
    </div>
  );
}
