type SchoolsResponse = {
  metadata: {
    total: number;
  };
  results: {
    id: string;
    "school.name": string;
  }[];
};

type SchoolResponse = {
  results: {
    id: string;
    "school.name": string;
    "school.city": string;
    "school.state": string;
    "school.school_url": string;
    "latest.student.size": number;
    "latest.cost.tuition.in_state": number;
    "latest.cost.tuition.out_of_state": number;
    "latest.aid.median_debt.completers.overall": number;
    "latest.academics.program_available.bachelor": boolean;
    "latest.earnings.10_yrs_after_entry.median": number;
    "latest.programs.cip_4_digit": {
      code: string;
      title: string;
    }[];
  }[];
};

type EarningsDetails = {
  overall_median_earnings: number;
};

type HighestEarnings = {
  highest: {
    "1_yr": EarningsDetails;
    "2_yr": EarningsDetails;
  };
};

export type ProgramResponse = {
  results: {
    "latest.programs.cip_4_digit": {
      code: string;
      unit_id: string;
      title: string;
      earnings: HighestEarnings;
    }[];
  }[];
};

export async function fetchSchools(
  stateCode: string
): Promise<{ id: string; name: string }[]> {
  const API_KEY = process.env.NEXT_PUBLIC_COLLEGEBOARD_API_KEY;
  const PER_PAGE = 100;

  const initialUrl = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&school.state=${stateCode}&fields=id,school.name&per_page=${PER_PAGE}&page=0`;

  try {
    const initialResponse = await fetch(initialUrl);
    const initialData: SchoolsResponse = await initialResponse.json();
    const total = initialData.metadata.total;

    const totalPages = Math.ceil(total / PER_PAGE);

    if (totalPages <= 1) {
      return initialData.results.map((school) => ({
        id: school.id,
        name: school["school.name"],
      }));
    }

    const fetchPromises = Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(
        `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&school.state=${stateCode}&fields=id,school.name&per_page=${PER_PAGE}&page=${
          i + 1
        }`
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error(`Error fetching page ${i + 1}:`, error);
          return { results: [] };
        })
    );

    const results = await Promise.all(fetchPromises);

    const allSchools = [
      ...initialData.results.map((school) => ({
        id: school.id,
        name: school["school.name"],
      })),
      ...results.flatMap(
        (data) =>
          data.results?.map(
            (school: { id: string; "school.name": string }) => ({
              id: school.id,
              name: school["school.name"],
            })
          ) || []
      ),
    ];

    return allSchools;
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
}

export async function fetchSchool(school_id: string) {
  const API_KEY = process.env.NEXT_PUBLIC_COLLEGEBOARD_API_KEY;

  const initialUrl = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&id=${school_id}&fields=id,school.name,school.city,school.state,school.school_url,latest.student.size,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.aid.median_debt.completers.overall,latest.academics.program_available.bachelor,latest.earnings.10_yrs_after_entry.median,latest.programs.cip_4_digit.code,latest.programs.cip_4_digit.title&latest.programs.cip_4_digit.credential.level=3`;
  const initialResponse = await fetch(initialUrl);
  const initialData: SchoolResponse = await initialResponse.json();
  return initialData;
}

export async function fetchProgramData(
  school_id: string,
  program_code: string
) {
  const API_KEY = process.env.NEXT_PUBLIC_COLLEGEBOARD_API_KEY;

  const initialUrl = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&id=${school_id}&latest.programs.cip_4_digit.code=${program_code}&latest.programs.cip_4_digit.credential.level=3&fields=latest.programs.cip_4_digit.unit_id,latest.programs.cip_4_digit.code,latest.programs.cip_4_digit.title,latest.programs.cip_4_digit.earnings.highest.1_yr.overall_median_earnings,latest.programs.cip_4_digit.earnings.highest.2_yr.overall_median_earnings`;
  const initialResponse = await fetch(initialUrl);
  const initialData: ProgramResponse = await initialResponse.json();
  return initialData;
}
