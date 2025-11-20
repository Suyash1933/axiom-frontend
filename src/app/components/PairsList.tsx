// components/PairsList.tsx
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  Search,
  Users,
  Trophy,
} from "lucide-react";

type PairItem = {
  id: string;
  title: string;
  subtitle?: string;
  age: string;
  // numeric value used for live updates
  value: number;
  // display price (kept for compatibility)
  price?: string;
  stats: { label: string; value?: string; color?: string }[];
  tags?: string[]; // e.g. ["P1"]
  image?: string;
};

const SAMPLE: PairItem[] = [
  {
    id: "1",
    title: "Pumpmas",
    subtitle: "Pumpmas",
    age: "0s",
    value: 13600, // represents 13.6K
    price: "$4K",
    tags: ["P1"],
    stats: [{ label: "Risk", value: "13%", color: "red" }],
    image: "/images/pill.png",
  },
  {
    id: "2",
    title: "ARNIE",
    subtitle: "Justice for Arnie",
    age: "0s",
    value: 4890, // 4.89K
    price: "$547",
    tags: ["P2"],
    stats: [{ label: "Risk", value: "13%", color: "green" }],
    image: "/images/letter-a.png",
  },
  {
    id: "3",
    title: "AMM",
    subtitle: "Ai Money Machine",
    age: "17s",
    value: 4340, // 4.34K
    price: "$276",
    tags: ["P3"],
    stats: [{ label: "Risk", value: "0%", color: "green" }],
    image: "/images/example.png",
  },
  // more items to allow scrolling
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `extra-${i}`,
    title: `Extra ${i + 1}`,
    subtitle: "auto generated",
    age: `${i + 1}s`,
    value: (i + 1) * 1000,
    price: `$${(i + 1) * 100}`,
    tags: i % 3 === 0 ? ["P1"] : i % 3 === 1 ? ["P2"] : ["P3"],
    stats: [{ label: "Vol", value: `${i + 2}%`, color: "green" }],
    image: "/images/example.png",
  })),
];

type FloatBadge = {
  id: string;
  amount: number; // raw numeric delta (can be shown as absolute or percent)
  direction: "up" | "down";
  key: number; // unique key to force re-render
};

export default function PairsList({ title = "New Pairs" }: { title?: string }) {
  // liveItems: items with numeric values we will mutate
  const [liveItems, setLiveItems] = useState<PairItem[]>(SAMPLE);
  const [activePills, setActivePills] = useState<string[]>(["P1"]);
  const [filterOpen, setFilterOpen] = useState(false);

  // floating badges state (map of id -> FloatBadge). Using array for ordering.
  const [floating, setFloating] = useState<FloatBadge[]>([]);

  // keep ref to interval so we can clear it on unmount
  const intervalRef = useRef<number | null>(null);

  // toggle pill
  const togglePill = (p: string) =>
    setActivePills((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  // visible items based on pills (no change from before)
  const visible = useMemo(() => {
    if (activePills.length === 0) return liveItems;
    return liveItems.filter((it) => it.tags?.some((t) => activePills.includes(t)));
  }, [activePills, liveItems]);

  // format numeric value to a string like "$13.6K" (keeps previous visual style)
  function fmtValue(v: number) {
    if (Math.abs(v) >= 1000000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(2)}K`;
    return `$${v.toFixed(2)}`;
  }

  // start a timer to randomly update values every X ms
  useEffect(() => {
    // if you prefer a faster or slower update, change this number
    const intervalMs = 1500;

    intervalRef.current = window.setInterval(() => {
      setLiveItems((prev) => {
        // create new array to trigger re-render
        const next = prev.map((item) => ({ ...item }));

        // We'll update only ones that are currently visible according to current pills
        const visibleIds = new Set(
          (activePills.length === 0 ? next : next.filter((it) => it.tags?.some((t) => activePills.includes(t)))).map(
            (it) => it.id
          )
        );

        // For each visible item, randomly change its value by -2% .. +2%
        visibleIds.forEach((id) => {
          const idx = next.findIndex((n) => n.id === id);
          if (idx === -1) return;

          const oldVal = next[idx].value;
          // change percent between -2% and +2%
          const pct = (Math.random() * 4 - 2) / 100;
          const newVal = Math.max(0, oldVal * (1 + pct));

          next[idx].value = Number(newVal.toFixed(2));

          const delta = newVal - oldVal;
          const direction: FloatBadge["direction"] = delta >= 0 ? "up" : "down";

          // add a floating badge for this id (with unique key)
          const badge: FloatBadge = {
            id,
            amount: Math.abs(Number(delta.toFixed(2))),
            direction,
            key: Date.now() + Math.floor(Math.random() * 1000),
          };

          // push into floating state (we'll manage clearing badges below)
          setFloating((f) => {
            // remove any existing badge for same id quickly to avoid duplicates
            const others = f.filter((b) => b.id !== id);
            return [...others, badge];
          });

          // schedule badge removal after 900ms
          window.setTimeout(() => {
            setFloating((f) => f.filter((b) => b.key !== badge.key));
          }, 900);
        });

        return next;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // include activePills in deps so updates are relevant to current filter selection
  }, [activePills]);

  // helper to pick the floating badge for a row (returns null or badge)
  function badgeFor(id: string) {
    // pick the most recent badge for that id
    for (let i = floating.length - 1; i >= 0; i--) {
      if (floating[i].id === id) return floating[i];
    }
    return null;
  }

  return (
    <section className="w-full px-6 md:px-10 py-4">
      <div className="w-1/3 min-w-[340px]">
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-white">{title}</h3>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0c0c0e] border border-gray-800 text-sm rounded-full px-3 py-1">
              <Zap size={14} className="text-gray-200" />
              <span className="text-sm text-gray-200">0</span>
            </div>

            <div className="flex items-center gap-1">
              {["P1", "P2", "P3"].map((p) => {
                const active = activePills.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePill(p)}
                    className={`px-2 py-1 rounded-full text-sm border ${
                      active ? "bg-[#0b1220] border-blue-500 text-blue-400" : "bg-transparent border-gray-700 text-gray-300"
                    }`}
                    title={`Toggle ${p}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setFilterOpen((s) => !s)}
              className="p-2 ml-2 rounded-full border border-gray-700 hover:border-gray-600"
              title="Filter"
            >
              <SlidersHorizontal size={8} />
            </button>
          </div>
        </div>

        {/* scrollable list */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3" role="list" aria-label={`${title} list`}>
          {visible.map((it) => {
            const badge = badgeFor(it.id);
            const formatted = fmtValue(it.value);
            return (
              <article
                key={it.id}
                className="relative flex items-start gap-3 bg-[#0b0b0d] border border-gray-800 rounded-lg p-3 hover:bg-[#0f1012] transition"
                role="listitem"
              >
                <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-700 flex-shrink-0">
                  <img
                    src={`https://robohash.org/${encodeURIComponent(it.title + "-" + activePills.join("|"))}?set=set3`}
                    alt={it.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">{it.title}</h4>
                        <span className="text-xs text-gray-400 truncate">{it.subtitle}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {it.age}
                        </span>
                        <span>·</span>
                        <span>MC</span>

                        <div className="flex items-center gap-1 ml-1">
                          <Search size={12} />
                          <Users size={12} />
                          <Trophy size={12} />
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm text-gray-200 font-medium">{formatted}</div>
                      <div className="text-xs text-gray-400">{it.price}</div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {it.stats.map((s, i) => (
                      <span
                        key={i}
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          s.color === "red"
                            ? "bg-[#2a0d10] border-red-700 text-red-300"
                            : s.color === "green"
                            ? "bg-[#06140b] border-green-700 text-green-300"
                            : s.color === "blue"
                            ? "bg-[#0b112a] border-blue-700 text-blue-300"
                            : "bg-[#0b0b0d] border-gray-700 text-gray-300"
                        }`}
                      >
                        {s.label} {s.value}
                      </span>
                    ))}

                    <div className="ml-auto text-[11px] text-gray-400 flex items-center gap-2">
                      <span>F</span>
                      <span>TX</span>
                    </div>
                  </div>
                </div>

                <button className="p-1.5 rounded-full border border-gray-700 text-gray-300 hover:border-gray-600 flex-shrink-0">
                  <ChevronRight size={18} />
                </button>

                {/* floating badge: absolutely positioned near right side and animated */}
                {badge && (
                  <span
                    key={badge.key}
                    style={{
                      position: "absolute",
                      right: 52,
                      top: 10,
                      // animation: translate up or down and fade out
                      transform: `translateY(${badge.direction === "up" ? "-8px" : "8px"})`,
                      opacity: 1,
                      transition: "transform 700ms ease, opacity 700ms ease",
                      pointerEvents: "none",
                      zIndex: 40,
                    }}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      badge.direction === "up" ? "bg-green-900/80 text-green-300 border border-green-700" : "bg-red-900/80 text-red-300 border border-red-700"
                    }`}
                  >
                    {badge.direction === "up" ? "▲" : "▼"} {Math.abs(badge.amount) >= 1 ? fmtValue(badge.amount) : `${(badge.amount).toFixed(2)}`}
                  </span>
                )}
              </article>
            );
          })}

          {visible.length === 0 && <div className="py-6 text-center text-gray-400">No pairs match the selected pill(s).</div>}
        </div>
      </div>
    </section>
  );
}
