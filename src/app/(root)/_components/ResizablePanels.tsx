"use client";

import { useState, useEffect, useRef } from "react";
import EditorPanel from "./EditorPanel";
import OutputPanel from "./OutputPanel";

export default function ResizablePanels() {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || isMobile) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= 30 && newLeftWidth <= 70) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, isMobile]);

  const handleMouseDown = () => {
    if (!isMobile) {
      setIsDragging(true);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <EditorPanel />
        <OutputPanel />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex gap-4 h-full">
      <div style={{ width: `${leftWidth}%` }} className="min-w-0">
        <EditorPanel />
      </div>
      
      <div
        onMouseDown={handleMouseDown}
        className={`w-2 cursor-col-resize relative group flex-shrink-0 ${
          isDragging ? "bg-blue-500/20" : "bg-transparent hover:bg-blue-500/20"
        } transition-colors rounded-full`}
      >
        <div
          className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 rounded-full transition-colors ${
            isDragging ? "bg-blue-500" : "bg-gray-700/50 group-hover:bg-blue-500"
          }`}
        />
      </div>
      
      <div style={{ width: `${100 - leftWidth - 1}%` }} className="min-w-0">
        <OutputPanel />
      </div>
    </div>
  );
}
