import React from "react";
import { fetchUniversity } from "@/lib/api";
import SchoolHeader from "./components/SchoolHeader";
import SchoolStats from "./components/SchoolStats";

async function UniversityPage({
  params,
}: {
  params: { universityName: string };
}) {
  const { universityName } = await params;
  const university = decodeURIComponent(universityName);
  const data = await fetchUniversity(university);
  const schoolData = data.results[0];

  if (!schoolData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">
          University not found
        </h1>
      </div>
    );
  }

  // ----- School Data ----- //
  const name = schoolData["school.name"];
  const city = schoolData["school.city"];
  const state = schoolData["school.state"];
  const url = schoolData["school.school_url"];
  const studentSize = schoolData["latest.student.size"];
  const tuitionInState = schoolData["latest.cost.tuition.in_state"];
  const tuitionOutOfState = schoolData["latest.cost.tuition.out_of_state"];
  const medianEarnings =
    schoolData["latest.earnings.10_yrs_after_entry.median"];
  const medianDebt = schoolData["latest.aid.median_debt.completers.overall"];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <SchoolHeader name={name} city={city} state={state} url={url} />
      <SchoolStats
        studentSize={studentSize}
        tuitionInState={tuitionInState}
        tuitionOutOfState={tuitionOutOfState}
        medianEarnings={medianEarnings}
        medianDebt={medianDebt}
      />
    </div>
  );
}

export default UniversityPage;
