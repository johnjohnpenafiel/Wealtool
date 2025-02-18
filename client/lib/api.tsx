//  This is the API call to fetch the schools from the API
//  It takes in the state code and returns the schools in the state
export async function fetchSchools(stateCode: string) {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const url = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&school.state=${stateCode}&fields=school.name&per_page=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((school: any) => school["school.name"]);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
}
