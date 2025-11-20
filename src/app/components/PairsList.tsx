// components/PairsList.tsx
"use client";

import { useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import {
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
  value: number; // numeric driving sorting
  price?: string;
  stats: { label: string; value?: string; color?: string }[];
  tags?: string[];
  image?: string;
};

const SAMPLE: PairItem[] = [
  { id: "1", title: "Pumpmas", subtitle: "Pumpmas", age: "0s", value: 13600, price: "$4K", tags: ["P1"], stats: [{ label: "Risk", value: "13%", color: "red" }], image: "/images/pill.png" },
  { id: "2", title: "ARNIE", subtitle: "Justice for Arnie", age: "0s", value: 4890, price: "$547", tags: ["P2"], stats: [{ label: "Risk", value: "13%", color: "green" }], image: "/images/letter-a.png" },
  { id: "3", title: "AMM", subtitle: "Ai Money Machine", age: "17s", value: 4340, price: "$276", tags: ["P3"], stats: [{ label: "Risk", value: "0%", color: "green" }], image: "/images/example.png" },
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

export default function PairsList({ title = "New Pairs" }: { title?: string }) {
  const [items, setItems] = useState<PairItem[]>(SAMPLE);
  const [activePills, setActivePills] = useState<string[]>(["P1"]);
  const [filterOpen, setFilterOpen] = useState(false);

  type FloatBadge = { id: string; amount: number; direction: "up" | "down"; key: number };
  const [floating, setFloating] = useState<FloatBadge[]>([]);

  // refs for FLIP
  const rowRefs = useRef<Record<string, HTMLElement | null>>({});
  const prevRects = useRef<Record<string, DOMRect>>({});

  // toggle pill
  const togglePill = (p: string) =>
    setActivePills((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  // visible list sorted by value desc (this determines DOM order)
  const visible = useMemo(() => {
    const filtered = activePills.length === 0 ? items : items.filter((it) => it.tags?.some((t) => activePills.includes(t)));
    return filtered.slice().sort((a, b) => b.value - a.value);
  }, [items, activePills]);

  function fmtValue(v: number) {
    if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(2)}K`;
    return `$${v.toFixed(2)}`;
  }

  // Capture current DOM positions of visible rows BEFORE the update
  function capturePositions() {
    const map: Record<string, DOMRect> = {};
    visible.forEach((it) => {
      const el = rowRefs.current[it.id];
      if (el) map[it.id] = el.getBoundingClientRect();
    });
    prevRects.current = map;
  }

  // Animate from previous rects to current rects (FLIP)
  function animateFromPrevious() {
    const prev = prevRects.current;
    visible.forEach((it) => {
      const el = rowRefs.current[it.id];
      if (!el) return;
      const prevRect = prev[it.id];
      const newRect = el.getBoundingClientRect();
      if (!prevRect) return;
      const dx = prevRect.left - newRect.left;
      const dy = prevRect.top - newRect.top;
      if (dx === 0 && dy === 0) return;

      // apply inverse transform
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.getBoundingClientRect();
      // animate to natural position
      el.style.transition = "transform 420ms cubic-bezier(0.2,0.8,0.2,1)";
      el.style.transform = "";
      const cleanup = () => {
        if (!el) return;
        el.style.transition = "";
        el.style.transform = "";
        el.removeEventListener("transitionend", cleanup);
      };
      el.addEventListener("transitionend", cleanup);
    });
  }

  // Run FLIP after layout when items or activePills change
  useLayoutEffect(() => {
    // small timeout to ensure DOM has updated and refs assigned
    // but useLayoutEffect runs before paint so this is safe and immediate
    animateFromPrevious();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.map((v) => v.id).join("|")]);

  // Live updater: change numeric values and set floating badges.
  useEffect(() => {
    const intervalMs = 1500;
    const id = window.setInterval(() => {
      // 1) capture positions BEFORE updating items
      capturePositions();

      // 2) update values for items that match current filter (or all if none)
      setItems((prev) => {
        const next = prev.map((p) => ({ ...p }));
        const candidates = next.filter((n) => activePills.length === 0 || n.tags?.some((t) => activePills.includes(t)));
        // random small percent change; you can adjust range or bias here
        candidates.forEach((item) => {
          const idx = next.findIndex((x) => x.id === item.id);
          if (idx === -1) return;
          const oldVal = next[idx].value;
          const pct = (Math.random() * 9 - 3) / 100; // -3% .. +6%
          const newVal = Math.max(0, oldVal * (1 + pct));
          next[idx].value = Number(newVal.toFixed(2));

          const delta = newVal - oldVal;
          const direction: FloatBadge["direction"] = delta >= 0 ? "up" : "down";
          const badge: FloatBadge = {
            id: item.id,
            amount: Math.abs(Number(delta.toFixed(2))),
            direction,
            key: Date.now() + Math.floor(Math.random() * 1000),
          };
          setFloating((f) => {
            const others = f.filter((b) => b.id !== item.id);
            return [...others, badge];
          });
          window.setTimeout(() => setFloating((f) => f.filter((b) => b.key !== badge.key)), 900);
        });
        return next;
      });

      // 3) After state update, useLayoutEffect will run and trigger animateFromPrevious.
      // No extra code here; useLayoutEffect depends on visible order change.
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [activePills]);

  function badgeFor(id: string) {
    for (let i = floating.length - 1; i >= 0; i--) if (floating[i].id === id) return floating[i];
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
                ref={(el) => (rowRefs.current[it.id] = el)}
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

                {/* floating badge */}
                {badge && (
                  <span
                    key={badge.key}
                    style={{
                      position: "absolute",
                      right: 52,
                      top: 10,
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
                    {badge.direction === "up" ? "▲" : "▼"} {Math.abs(badge.amount) >= 1 ? fmtValue(badge.amount) : `${badge.amount.toFixed(2)}`}
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
