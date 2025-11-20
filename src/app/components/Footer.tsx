"use client";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-[#0b0b0d] border-t border-gray-800 backdrop-blur-lg">
      <div className="max-w-[2000px] mx-auto px-4 md:px-10 py-2 flex items-center justify-between gap-6">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 text-gray-300 text-sm">

          {/* PRESET BUTTON */}
          <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#0f1720] text-blue-400">
            <i className="fa-solid fa-sliders text-blue-400" />
            PRESET 1
          </button>

          {/* COUNTER */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#0f1720] border border-gray-700">
            <i className="fa-regular fa-square" />
            <span className="text-white">1</span>
          </div>

          {/* WALLET */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <i className="fa-solid fa-wallet" />
            <span>Wallet</span>
            <span className="text-red-500 text-xs">●</span>
          </div>

          {/* TWITTER */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <i className="fa-brands fa-twitter" />
            <span>Twitter</span>
            <span className="text-red-500 text-xs">●</span>
          </div>

          {/* DISCOVER */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <i className="fa-solid fa-compass" />
            <span>Discover</span>
            <span className="text-red-500 text-xs">●</span>
          </div>

          {/* PULSE */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <i className="fa-solid fa-chart-line" />
            <span>Pulse</span>
            <span className="text-red-500 text-xs">●</span>
          </div>

          {/* PnL */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <i className="fa-solid fa-chart-column" />
            <span>PnL</span>
          </div>

          {/* FIRE + SOL PRICE */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f1720] border border-gray-700">
            <span>🔥</span>
            <span className="text-green-400">$137.12</span>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 text-gray-300 text-sm">

          {/* CONNECTION STATUS */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/60 text-green-100">
            <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
            Connection is stable
          </div>

          {/* GLOBAL DROPDOWN */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            GLOBAL <i className="fa-solid fa-chevron-down text-xs" />
          </div>

          {/* UI ICONS */}
          <i className="fa-regular fa-square cursor-pointer hover:text-white" />
          <i className="fa-regular fa-bell cursor-pointer hover:text-white" />
          <i className="fa-regular fa-circle-question cursor-pointer hover:text-white" />
          <i className="fa-brands fa-discord cursor-pointer hover:text-white" />
          <i className="fa-solid fa-xmark cursor-pointer hover:text-white" />

          {/* Docs */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <i className="fa-solid fa-book" />
            Docs
          </div>

        </div>

      </div>
    </footer>
  );
}
