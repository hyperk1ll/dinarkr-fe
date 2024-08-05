"use client";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import React from "react";

export default function Home() {
  

  return (
    <div className="w-full bg-white">
      <Navbar />
      
      <div className="h-screen">
      <Sidebar />
      </div>
    </div>
  );
}
