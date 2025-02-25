"use server";

import { fetchSchool } from "@/lib/api";

export async function submitSchool(school_id: string) {
  const data = await fetchSchool(school_id);
  return data;
}
