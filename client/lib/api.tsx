type SchoolResponse = {
  metadata: {
    total: number;
  };
  results: { "school.name": string }[];
};

export async function fetchSchools(stateCode: string): Promise<string[]> {
  const API_KEY = process.env.NEXT_PUBLIC_COLLEGEBOARD_API_KEY;
  let allSchools: string[] = [];
  let page = 0;
  let total = Infinity; // Start with an arbitrary high value

  do {
    const url = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&school.state=${stateCode}&fields=school.name&per_page=100&page=${page}`;

    try {
      const response = await fetch(url);
      const data: SchoolResponse = await response.json();

      if (data.results.length > 0) {
        allSchools = [
          ...allSchools,
          ...data.results.map((school) => school["school.name"]),
        ];
        total = data.metadata.total;
      } else {
        break; // Stop if no more results
      }

      page++;
    } catch (error) {
      console.error("Error fetching schools:", error);
      break;
    }
  } while (allSchools.length < total);

  return allSchools;
}
