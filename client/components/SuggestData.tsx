"use client";

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface SuggestDataProps {
  searchTerm: string;
  onSelect: (stateName: string) => void;
  data: string[];
  className?: string;
  itemClassName?: string;
}

const SuggestData = ({
  searchTerm,
  onSelect,
  data,
  className,
  itemClassName,
}: SuggestDataProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const filteredData = data.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const limitedData = filteredData.slice(0, 8);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!limitedData.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIsKeyboardNav(true);
          setSelectedIndex((prev) =>
            prev < limitedData.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsKeyboardNav(true);
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          onSelect(limitedData[selectedIndex]);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [limitedData, selectedIndex, onSelect]);

  return (
    <ul
      className={twMerge(
        "absolute w-full z-10 bg-background rounded-md border-neutral-400/80 max-h-[450px] overflow-y-auto",
        className
      )}
    >
      {limitedData.map((d, index) => (
        <li
          className={twMerge(
            "min-h-16 md:min-h-28 text-2xl md:text-7xl px-4 py-5 cursor-pointer border-b last:border-b-0",
            index === selectedIndex ? "bg-neutral-300/20" : "",
            itemClassName
          )}
          key={`${d}-${index}`}
          onClick={() => onSelect(d)}
          onMouseEnter={() => {
            setIsKeyboardNav(false);
            setSelectedIndex(index);
          }}
          onMouseMove={() => {
            if (isKeyboardNav) {
              setIsKeyboardNav(false);
              setSelectedIndex(index);
            }
          }}
        >
          {d}
        </li>
      ))}
    </ul>
  );
};

export default SuggestData;

// 1. Filter the states based on the search term
// 2. Limit the number of states to 8
// 3. Map the states to a list of li elements
// 4. Return the list of li elements
