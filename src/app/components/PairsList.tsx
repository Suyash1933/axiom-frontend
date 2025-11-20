// components/PairsList.tsx
"use client";

import { useMemo, useState } from "react";
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
  mc: string;
  price?: string;
  stats: { label: string; value?: string; color?: string }[];
  tags?: string[]; // e.g. ["P1"]
  image?: string;
};

const SAMPLE: PairItem[] = [
  // (same sample items as before...)
  {
    id: "1",
    title: "Pumpmas",
    subtitle: "Pumpmas",
    age: "0s",
    mc: "$13.6K",
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
    mc: "$4.89K",
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
    mc: "$4.34K",
    price: "$276",
    tags: ["P3"],
    stats: [{ label: "Risk", value: "0%", color: "green" }],
    image: "/images/example.png",
  },
  // duplicate more items so scrolling is obvious
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `extra-${i}`,
    title: `Extra ${i + 1}`,
    subtitle: "auto generated",
    age: `${i + 1}s`,
    mc: `$${(i + 1) * 1000}`,
    price: `$${(i + 1) * 100}`,
    tags: i % 3 === 0 ? ["P1"] : i % 3 === 1 ? ["P2"] : ["P3"],
    stats: [{ label: "Vol", value: `${i + 2}%`, color: "green" }],
    image: "/images/example.png",
  })),
];

export default function PairsList({ title = "New Pairs" }: { title?: string }) {

  const [activePills, setActivePills] = useState<string[]>(["P1"]);
  const [filterOpen, setFilterOpen] = useState(false);

  const togglePill = (p: string) =>
    setActivePills((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const visible = useMemo(() => {
    if (activePills.length === 0) return SAMPLE;
    return SAMPLE.filter((it) => it.tags?.some((t) => activePills.includes(t)));
  }, [activePills]);

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
              <SlidersHorizontal size={8}  />
            </button>
          </div>
        </div>

        {/* ===== SCROLLABLE LIST AREA =====
            IMPORTANT: set an explicit max height so overflow-y works.
            Adjust max-h-[60vh] to fit your layout (e.g. 70vh, 50vh).
        */}
        <div
          className="max-h-[60vh] overflow-y-auto pr-2 space-y-3"
          role="list"
          aria-label="New pairs list"
        >
          {visible.map((it) => (
            <article
              key={it.id}
              className="flex items-start gap-3 bg-[#0b0b0d] border border-gray-800 rounded-lg p-3 hover:bg-[#0f1012] transition"
              role="listitem"
            >
              <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-700 flex-shrink-0">
                {/* IMAGE: changes when P1/P2/P3 filter changes */}
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
                      <span className="flex items-center gap-1"><Clock size={12} />{it.age}</span>
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
                    <div className="text-sm text-gray-200 font-medium">{it.mc}</div>
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
            </article>
          ))}

          {visible.length === 0 && <div className="py-6 text-center text-gray-400">No pairs match the selected pill(s).</div>}
        </div>
      </div>
    </section>
  );
}
