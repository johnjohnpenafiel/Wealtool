"use client";
import React, { useState } from "react";
import ProgramForm from "./ProgramForm";
import { fetchProgramData, ProgramResponse } from "@/lib/api";
import ProgramCard from "./ProgramCard";

interface Program {
  code: string;
  title: string;
}

interface Props {
  programs: Program[];
  schoolId: string;
}

export default function ProgramSection({ programs, schoolId }: Props) {
  const [programData, setProgramData] = useState<ProgramResponse | null>(null);

  const handleProgramSubmit = async (programCode: string) => {
    console.log("Selected program code:", programCode);
    const data = await fetchProgramData(schoolId, programCode);
    setProgramData(data);
  };

  return (
    <div>
      <div className="mt-8">
        <ProgramForm programs={programs} onSubmit={handleProgramSubmit} />
      </div>
      {programData && (
        <div className="mt-8">
          <ProgramCard
            title={
              programData.results[0]["latest.programs.cip_4_digit"][0].title
            }
            earnings1Year={
              programData.results[0]["latest.programs.cip_4_digit"][0].earnings
                .highest["1_yr"].overall_median_earnings
            }
            earnings2Year={
              programData.results[0]["latest.programs.cip_4_digit"][0].earnings
                .highest["2_yr"].overall_median_earnings
            }
          />
        </div>
      )}
    </div>
  );
}
