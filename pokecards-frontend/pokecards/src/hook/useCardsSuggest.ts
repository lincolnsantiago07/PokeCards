// src/hook/useCardSuggest.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:8080";

export function useCardSuggest(q: string, limit = 10) {
  const enabled = q.trim().length >= 2;       // começa a sugerir a partir de 2 chars
  return useQuery({
    queryKey: ["cards-suggest", q, limit],
    queryFn: async () => {
      const { data } = await axios.get<string[]>(`${API_URL}/cards/suggest`, { params: { q, limit }});
      return data;
    },
    enabled,
    staleTime: 60_000,
  });
}
