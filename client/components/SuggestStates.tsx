"use client";

import React, { useState, useEffect } from "react";
import { states } from "@/lib/data/states";

interface SuggestStatesProps {
  searchTerm: string;
  onStateSelect: (stateName: string) => void;
}

const SuggestStates = ({ searchTerm, onStateSelect }: SuggestStatesProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const limitedStates = filteredStates.slice(0, 8);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!limitedStates.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIsKeyboardNav(true);
          setSelectedIndex((prev) =>
            prev < limitedStates.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsKeyboardNav(true);
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          onStateSelect(limitedStates[selectedIndex].name);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [limitedStates, selectedIndex, onStateSelect]);

  return (
    <ul
      className={`absolute w-full z-10 bg-background rounded-md border-neutral-400/80 max-h-[600px] overflow-y-auto`}
    >
      {limitedStates.map((state, index) => (
        <li
          className={`h-16 md:h-28 text-2xl md:text-7xl px-4 py-5 cursor-pointer border-b last:border-b-0 ${
            index === selectedIndex ? "bg-neutral-300/20" : ""
          }`}
          key={state.code}
          onClick={() => onStateSelect(state.name)}
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
          {state.name}
        </li>
      ))}
    </ul>
  );
};

export default SuggestStates;

// 1. Filter the states based on the search term
// 2. Limit the number of states to 8
// 3. Map the states to a list of li elements
// 4. Return the list of li elements
