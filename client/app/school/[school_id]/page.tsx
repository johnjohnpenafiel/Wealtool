import { fetchSchool } from "@/lib/api";
import SchoolHeader from "@/app/school/components/SchoolHeader";
import SchoolStats from "@/app/school/components/SchoolStats";
import ProgramSection from "@/app/school/components/ProgramSection";

async function SchoolPage({ params }: { params: { school_id: string } }) {
  const { school_id } = await params;
  const school = decodeURIComponent(school_id);
  const data = await fetchSchool(school);
  const schoolData = data.results[0];

  if (!schoolData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">School not found</h1>
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
  const programs = schoolData["latest.programs.cip_4_digit"];

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
      <div className="mt-8">
        <ProgramSection programs={programs} />
      </div>
    </div>
  );
}

export default SchoolPage;
