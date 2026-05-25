"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  sellerProfiles,
  type SellerMetric,
  type SellerProfilePersona,
  type SignalColor,
} from "@/data/seller-profile";

// --- Signal colour config ---
const SIGNAL_STYLES: Record<
  SignalColor,
  { bg: string; border: string; text: string; dot: string; badge: string }
> = {
  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800",
  },
  yellow: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800",
  },
};

// --- Helpers ---
function metricStatus(
  metric: SellerMetric
): "good" | "warn" | "neutral" {
  if (metric.value === null) return "neutral";
  return metric.direction === "lower-is-better"
    ? metric.value <= metric.benchmark
      ? "good"
      : "warn"
    : metric.value >= metric.benchmark
    ? "good"
    : "warn";
}

function formatValue(
  value: number | null,
  unit: string,
  noDataLabel?: string
): string {
  if (value === null) return noDataLabel ?? "Brak danych";
  return unit === "%" ? `${value}%` : `${value}${unit}`;
}

// --- Sub-components ---
function MetricRow({ metric }: { metric: SellerMetric }) {
  const status = metricStatus(metric);
  const isGood = status === "good";
  const isNeutral = status === "neutral";

  const deltaArrow =
    isNeutral ? null : metric.direction === "lower-is-better"
      ? metric.value! <= metric.benchmark
        ? "↓"
        : "↑"
      : metric.value! >= metric.benchmark
      ? "↑"
      : "↓";

  const deltaText = isNeutral
    ? "Za mało danych"
    : isGood
    ? "Poniżej mediany — dobrze"
    : "Powyżej mediany kategorii";

  return (
    <div className="py-4 border-b border-black/5 last:border-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-warm-gray mb-2">
        {metric.label}
      </p>
      <div className="flex items-end gap-6">
        {/* Seller value */}
        <div>
          <p className="text-[10px] text-warm-gray mb-0.5">Twój wynik</p>
          <p
            className={cn(
              "text-2xl font-light",
              isNeutral
                ? "text-charcoal/40"
                : isGood
                ? "text-emerald-700"
                : "text-amber-700"
            )}
          >
            {formatValue(metric.value, metric.unit, metric.noDataLabel)}
          </p>
        </div>

        {/* Separator */}
        <div className="text-warm-gray/30 text-xl font-light mb-1">vs</div>

        {/* Benchmark */}
        <div>
          <p className="text-[10px] text-warm-gray mb-0.5">Benchmark kategorii</p>
          <p className="text-2xl font-light text-charcoal/50">
            {formatValue(metric.benchmark, metric.unit)}
          </p>
        </div>

        {/* Status pill */}
        {deltaArrow && (
          <div
            className={cn(
              "ml-auto mb-1 flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full",
              isGood
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            )}
          >
            <span>{deltaArrow}</span>
            <span>{deltaText}</span>
          </div>
        )}
        {isNeutral && (
          <div className="ml-auto mb-1 text-[11px] font-medium px-2 py-1 rounded-full bg-black/5 text-charcoal/50">
            {deltaText}
          </div>
        )}
      </div>
    </div>
  );
}

function RepeatRateRow({
  repeatRate,
}: {
  repeatRate: SellerProfilePersona["repeatRate"];
}) {
  const { value, benchmark } = repeatRate;
  const isNull = value === null;
  const isGood = !isNull && value >= benchmark;

  return (
    <div className="py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-warm-gray mb-2">
        Powtarzalność klientów
      </p>
      <div className="flex items-end gap-6">
        <div>
          <p className="text-[10px] text-warm-gray mb-0.5">Twój wynik</p>
          <p
            className={cn(
              "text-2xl font-light",
              isNull
                ? "text-charcoal/40"
                : isGood
                ? "text-emerald-700"
                : "text-charcoal"
            )}
          >
            {isNull ? "Brak danych" : `${value}%`}
          </p>
        </div>
        <div className="text-warm-gray/30 text-xl font-light mb-1">vs</div>
        <div>
          <p className="text-[10px] text-warm-gray mb-0.5">Benchmark kategorii</p>
          <p className="text-2xl font-light text-charcoal/50">{benchmark}%</p>
        </div>
        {!isNull && (
          <div
            className={cn(
              "ml-auto mb-1 flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full",
              isGood
                ? "bg-emerald-100 text-emerald-800"
                : "bg-black/5 text-charcoal/60"
            )}
          >
            <span>{isGood ? "↑" : "→"}</span>
            <span>
              {isGood ? "Powyżej mediany — dobrze" : "Zbliżone do mediany"}
            </span>
          </div>
        )}
        {isNull && (
          <div className="ml-auto mb-1 text-[11px] font-medium px-2 py-1 rounded-full bg-black/5 text-charcoal/50">
            Za mało danych
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main page ---
export default function SellerProfilePage() {
  const [activeId, setActiveId] = useState<SellerProfilePersona["id"]>("bartek");
  const persona = sellerProfiles.find((p) => p.id === activeId)!;
  const signal = SIGNAL_STYLES[persona.signal];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/account" className="hover:text-charcoal transition-colors">
          Account
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Profil Sellera</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-1">
        Profil operacyjny
      </h1>
      <p className="text-[13px] text-warm-gray mb-8">
        Jak radzisz sobie na tle innych sellerów w swojej kategorii.
      </p>

      {/* Persona switcher — demo only */}
      <div className="mb-8 p-3 border border-black/10 rounded-lg bg-black/[0.02]">
        <p className="text-[10px] uppercase tracking-[0.6px] text-warm-gray mb-2.5">
          Demo — wybierz perspektywę sellera
        </p>
        <div className="flex gap-2">
          {sellerProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={cn(
                "px-4 py-1.5 text-[12px] font-medium rounded-full border transition-all",
                activeId === p.id
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white text-charcoal border-black/15 hover:border-charcoal/40"
              )}
            >
              {p.displayName}
            </button>
          ))}
        </div>
      </div>

      {/* Seller header info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-charcoal/10 flex items-center justify-center">
          <span className="text-sm font-medium text-charcoal">
            {persona.displayName.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-[13px] font-medium text-charcoal">
            {persona.storeName}
          </p>
          <p className="text-[11px] text-warm-gray">
            {persona.category} ·{" "}
            {persona.tier === "negotiated" ? "Negotiated tier" : "Standard tier"} ·{" "}
            {persona.monthsActive} mies. na platformie
          </p>
        </div>
      </div>

      {/* Section A — Signal banner */}
      <div
        className={cn(
          "border rounded-lg p-4 mb-6 flex items-start gap-3",
          signal.bg,
          signal.border
        )}
      >
        <div
          className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", signal.dot)}
        />
        <div>
          <p className={cn("text-[13px] font-medium", signal.text)}>
            {persona.signalLabel}
          </p>
          <p className={cn("text-[12px] mt-0.5 opacity-80", signal.text)}>
            {persona.signalDescription}
          </p>
        </div>
      </div>

      {/* Section B — Metrics */}
      <section className="mb-6">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-4 pb-2 border-b border-black/10">
          Twoje wskaźniki vs benchmark kategorii
        </h2>
        <div>
          {persona.metrics.map((metric) => (
            <MetricRow key={metric.label} metric={metric} />
          ))}
          <RepeatRateRow repeatRate={persona.repeatRate} />
        </div>
      </section>

      {/* Section C — Insight */}
      <section className="mb-6">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-4 pb-2 border-b border-black/10">
          Insight tygodnia
        </h2>
        <div className="border border-black/10 rounded-lg p-5 bg-white">
          <p className="text-[13px] text-charcoal/80 leading-relaxed">
            {persona.insight.text}
          </p>
        </div>
      </section>

      {/* Section D — CTA */}
      <Link
        href={persona.insight.ctaHref}
        className="block w-full text-center btn-cta text-[12px] py-3"
      >
        {persona.insight.ctaLabel}
      </Link>
    </div>
  );
}
