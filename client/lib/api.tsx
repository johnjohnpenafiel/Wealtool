type SchoolResponse = {
  metadata: {
    total: number;
  };
  results: { "school.name": string }[];
};

export async function fetchSchools(stateCode: string): Promise<string[]> {
  const API_KEY = process.env.NEXT_PUBLIC_COLLEGEBOARD_API_KEY;
  const PER_PAGE = 100;

  const initialUrl = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&school.state=${stateCode}&fields=school.name&per_page=${PER_PAGE}&page=0`;

  try {
    const initialResponse = await fetch(initialUrl);
    const initialData: SchoolResponse = await initialResponse.json();
    const total = initialData.metadata.total;

    // Calculate total number of pages
    const totalPages = Math.ceil(total / PER_PAGE);

    // If there's only one page, return the initial results
    if (totalPages <= 1) {
      return initialData.results.map((school) => school["school.name"]);
    }

    // Create array of promises for parallel fetching (starting from page 1)
    const fetchPromises = Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(
        `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&school.state=${stateCode}&fields=school.name&per_page=${PER_PAGE}&page=${
          i + 1
        }`
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error(`Error fetching page ${i + 1}:`, error);
          return { results: [] };
        })
    );

    // Wait for all fetches to complete
    const results = await Promise.all(fetchPromises);

    // Combine initial results with the rest
    const allSchools = [
      ...initialData.results.map((school) => school["school.name"]),
      ...results.flatMap(
        (data) =>
          data.results?.map(
            (school: { "school.name": string }) => school["school.name"]
          ) || []
      ),
    ];

    return allSchools;
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
}
