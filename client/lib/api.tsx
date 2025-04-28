const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// type SchoolsResponse = {
//   metadata: {
//     total: number;
//   };
//   results: {
//     id: string;
//     "school.name": string;
//   }[];
// };

// type SchoolResponse = {
//   results: {
//     id: string;
//     "school.name": string;
//     "school.city": string;
//     "school.state": string;
//     "school.school_url": string;
//     "latest.student.size": number;
//     "latest.cost.tuition.in_state": number;
//     "latest.cost.tuition.out_of_state": number;
//     "latest.aid.median_debt.completers.overall": number;
//     "latest.academics.program_available.bachelor": boolean;
//     "latest.earnings.10_yrs_after_entry.median": number;
//     "latest.programs.cip_4_digit": {
//       code: string;
//       title: string;
//     }[];
//   }[];
// };

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

export async function fetchSchools(stateCode: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/fetch-schools?stateCode=${stateCode}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch schools");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
}

export async function fetchSchool(school_id: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/fetch-school?school_id=${school_id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch school details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching school:", error);
    return null;
  }
}

export async function fetchProgramData(
  school_id: string,
  program_code: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/fetch-program?school_id=${school_id}&program_code=${program_code}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch program data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching program data:", error);
    return null;
  }
}

export async function generateEarnings(
  degree: string,
  missing_earnings: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/generate-earnings?degree_title=${degree}&missing_earnings=${missing_earnings}`
    );

    if (!response.ok) {
      throw new Error("Failed to generate earnings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating earnings:", error);
    return null;
  }
}
