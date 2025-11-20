"use client";

import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white px-10 py-4 flex items-center justify-between border-b border-gray-800">

  {/* Left Section: Logo + Menu Together */}
  <div className="flex items-center gap-5"> 
      {/* reduced from big gap */}
    
    {/* Logo */}
    <div className="flex items-center gap-2">
      {/* <div className="w-5 h-5 bg-white rounded-sm" /> */}
      <h1 className="text-lg font-semibold"><i className="fa-solid fa-cubes"></i></h1>
    </div>

    {/* Menu */}
    <div className="hidden md:flex items-center gap-6 text-sm">
      <Link href="#" className="text-blue-400 font-medium hover:text-blue-500">Discover</Link>
      <Link href="#" className="hover:text-gray-300">Pulse</Link>
      <Link href="#" className="hover:text-gray-300">Trackers</Link>
      <Link href="#" className="hover:text-gray-300">Perpetuals</Link>
      <Link href="#" className="hover:text-gray-300">Yield</Link>
      <Link href="#" className="hover:text-gray-300">Vision</Link>
      <Link href="#" className="hover:text-gray-300">Portfolio</Link>
      <Link href="#" className="hover:text-gray-300">Rewards</Link>
    </div>

  </div>


      {/* Right Controls */}
      <div className="flex items-center gap-4">

        {/* Search Icon */}
        <button className="p-2 rounded-full border border-gray-700 hover:border-gray-500 transition">
          <Search size={18} />
        </button>

        {/* Dropdown */}
        {/* Small colored token icon */}
        <div className="hidden md:flex items-center px-3 py-1 border border-gray-800 rounded-full">
          <div className="w-5 h-5 rounded bg-gradient-to-r from-cyan-400 to-purple-400 mr-2" />
          <span className="text-sm text-gray-200">SOL</span>
          <ChevronDown size={12} className="ml-2 text-gray-400" />
        </div>

        {/* Sign Up */}
        <button className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 font-medium transition">
          Sign up
        </button>

        {/* Login */}
        <button className="px-5 py-2 rounded-full bg-gray-800 hover:bg-gray-700 font-medium transition">
          Login
        </button>
      </div>
    </nav>
  );
}
