"use client";

import React, { useState, useEffect } from "react";

interface SuggestSchoolsProps {
  searchTerm: string;
  onSchoolSelect: (schoolName: string) => void;
  schools: string[];
}

const SuggestSchools = ({
  searchTerm,
  onSchoolSelect,
  schools,
}: SuggestSchoolsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const filteredSchools = schools.filter((school) =>
    school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const limitedSchools = filteredSchools.slice(0, 8);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!limitedSchools.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIsKeyboardNav(true);
          setSelectedIndex((prev) =>
            prev < limitedSchools.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsKeyboardNav(true);
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          onSchoolSelect(limitedSchools[selectedIndex]);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [limitedSchools, selectedIndex, onSchoolSelect]);

  return (
    <ul className="absolute w-full z-10 bg-background rounded-md border-neutral-400/80 max-h-[450px] overflow-y-auto">
      {limitedSchools.map((school, index) => (
        <li
          className={`flex min-h-16 md:minh-28 text-2xl md:text-7xl px-4 py-5 cursor-pointer border-b last:border-b-0 break-words ${
            index === selectedIndex ? "bg-neutral-300/20" : ""
          }`}
          key={school}
          onClick={() => onSchoolSelect(school)}
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
          {school}
        </li>
      ))}
    </ul>
  );
};

export default SuggestSchools;
