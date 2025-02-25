"use server";

import { fetchUniversity } from "@/lib/api";

export async function submitSchool(universityName: string) {
  const data = await fetchUniversity(universityName);
  return data;
}
