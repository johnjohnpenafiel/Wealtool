"use client";
import React from "react";
import ProgramForm from "./ProgramForm";

interface Program {
  code: string;
  title: string;
}

export default function ProgramSection({ programs }: { programs: Program[] }) {
  const handleProgramSubmit = (programCode: string) => {
    // Handle the program selection here
    console.log("Selected program code:", programCode);
    // Navigate or perform other actions
  };
  return (
    <div className="mt-8">
      <ProgramForm programs={programs} onSubmit={handleProgramSubmit} />
    </div>
  );
}
