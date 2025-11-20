// components/SubNavbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Star,
  BarChart2,
  ChevronDown,
  SlidersHorizontal,
  Bookmark,
  EyeOff,
  MoreHorizontal,
} from "lucide-react";

export default function SubNavbar() {
  const [activeTab, setActiveTab] = useState("Trending");
  const [activeTime, setActiveTime] = useState("5m");
  const [pumpOpen, setPumpOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [countersOpen, setCountersOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const pumpRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const countersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (pumpRef.current && !pumpRef.current.contains(e.target as Node)) setPumpOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
      if (countersRef.current && !countersRef.current.contains(e.target as Node)) setCountersOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const tabs = ["Trending", "Surge", "DEX Screener", "Pump Live"];
  const times = ["1m", "5m", "30m", "1h"];
  const pills = ["P1", "P2", "P3"];

  return (
    <div className="w-full bg-[#0b0b0d] h-20 border-b border-gray-800 flex flex-col px-6 md:px-10 py-2">
      {/* top small icon row */}
      <div className="flex items-center gap-2 mb-2">
        <button title="Settings" className="p-1.5 rounded border border-transparent hover:border-gray-700 transition">
          <Settings size={14} className="text-gray-400" />
        </button>
        <button title="Favorites" className="p-1.5 rounded border border-transparent hover:border-gray-700 transition">
          <Star size={14} className="text-gray-400" />
        </button>
        <button title="Stats" className="p-1.5 rounded border border-transparent hover:border-gray-700 transition">
          <BarChart2 size={14} className="text-gray-400" />
        </button>
      </div>

      {/* main row */}
      <div className="flex items-center w-full">
        {/* LEFT: Tabs */}
        <div className="flex items-center gap-6 whitespace-nowrap shrink-0">
          {tabs.map((t) => {
            const isPump = t === "Pump Live";
            const active = activeTab === t;
            return (
              <div key={t} ref={isPump ? pumpRef : null} className="relative flex items-center">
                <button
                  onClick={() => {
                    if (isPump) {
                      setPumpOpen((s) => !s);
                      setActiveTab(t);
                    } else {
                      setActiveTab(t);
                      setPumpOpen(false);
                    }
                  }}
                  className={`text-[18px] leading-none transition-colors ${active ? "text-white font-semibold" : "text-gray-400"}`}
                >
                  {t}
                </button>

                {isPump && (
                  <button onClick={() => setPumpOpen((s) => !s)} className="ml-1 text-gray-400 hover:text-gray-200">
                    <ChevronDown size={14} />
                  </button>
                )}

                {isPump && pumpOpen && (
                  <div className="absolute top-10 left-0 z-40 w-44 bg-[#0b0b0d] border border-gray-800 rounded-md shadow-lg p-2">
                    <button className="w-full text-left px-2 py-1 text-sm text-gray-200 hover:bg-gray-900 rounded">Pump Live • A</button>
                    <button className="w-full text-left px-2 py-1 text-sm text-gray-200 hover:bg-gray-900 rounded mt-1">Pump Live • B</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CENTER: time filters + Filter button */}
        <div className="flex-1 flex justify-center md:justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {times.map((tm) => {
                const active = activeTime === tm;
                return (
                  <button
                    key={tm}
                    onClick={() => setActiveTime(tm)}
                    className={`text-sm ${active ? "text-white font-semibold" : "text-gray-400 hover:text-gray-200"}`}
                  >
                    {tm}
                  </button>
                );
              })}
            </div>

            {/* Filter button */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[grey] border border-gray-700 rounded-full text-sm"
              >
                <SlidersHorizontal size={14} />
                <span className="hidden md:inline">Filter</span>
                <ChevronDown size={12} />
              </button>

              {filterOpen && (
                <div className="absolute mt-2 left-1/2 transform -translate-x-1/2 w-56 bg-[#0b0b0d] border border-gray-800 rounded-md p-3 z-50">
                  <div className="text-sm text-gray-300 mb-2">Filters</div>
                  <label className="flex justify-between text-sm text-gray-300">
                    Min Volume
                    <input className="bg-transparent border border-gray-700 rounded px-2 py-1 text-sm w-24" placeholder="0" />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button title="Bookmark" className="p-2 rounded-full border border-gray-700 hover:border-gray-600">
            <Bookmark size={14} />
          </button>

          <button title={hidden ? "Show" : "Hide"} onClick={() => setHidden((s) => !s)} className="p-2 rounded-full border border-gray-700 hover:border-gray-600">
            <EyeOff size={14} className={`${hidden ? "opacity-50" : ""}`} />
          </button>

          {/* counters */}
          <div className="relative" ref={countersRef}>
            <button onClick={() => setCountersOpen((s) => !s)} className="flex items-center gap-1 px-2 py-1 border border-gray-700 rounded-full">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-400 to-purple-400" />
              <span className="text-sm text-gray-200">0</span>
              <ChevronDown size={12} />
            </button>

            {countersOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#0b0b0d] border border-gray-800 rounded-md shadow-lg p-2 z-50">
                <div className="text-sm text-gray-300 mb-1">Wallets</div>
                <div className="text-sm text-gray-200 px-2 py-1 hover:bg-gray-900 rounded">Wallet A — 0</div>
              </div>
            )}
          </div>

          {/* Quick Buy */}
          <div className="flex items-center gap-2 px-3 py-1 border border-gray-700 rounded-full">
            <span className="text-sm text-gray-200">Quick Buy</span>
            <span className="text-sm px-2 py-0.5 border border-gray-700 rounded">0.0</span>
          </div>


          {/* P1 P2 P3 */}
          <div className="flex items-center gap-1">
            {pills.map((p, i) => (
              <button key={p} className={`px-3 py-1 rounded-full text-sm border border-gray-700 ${i === 0 ? "text-blue-400" : "text-gray-300"}`}>
                {p}
              </button>
            ))}
          </div>

          <button className="p-2 rounded-full border border-gray-700 hover:border-gray-600">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
