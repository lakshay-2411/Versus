import { VERSUS_URL } from "@/lib/apiEndPoints";

export async function fetchVersus(token: string) {
  const res = await fetch(VERSUS_URL, {
    headers: {
      Authorization: token,
    },
    next: {
      revalidate: 60 * 60,
      tags: ["dashboard"],
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return [];
}
