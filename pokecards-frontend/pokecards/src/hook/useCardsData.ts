// src/hook/useCardsData.ts
import axios from "axios";
import type { Pokecards, PageResponse } from "../interface/CardData";
import { useQuery } from "@tanstack/react-query";

export type SortField = "name" | "rarity" | "price";
export type SortDirection = "asc" | "desc";
export type SortSpec = { field: SortField; direction: SortDirection };

const API_URL = "http://localhost:8080";

export type UseCardDataParams = {
  page?: number;
  size?: number;
  sorts?: SortSpec[];
  q?: string;                    
};

function buildParams({ page = 0, size = 250, sorts = [{ field:"name", direction:"asc" }], q }: UseCardDataParams) {
  const p = new URLSearchParams();
  p.set("page", String(page));
  p.set("size", String(size));
  if (q && q.trim()) p.set("q", q.trim());
  sorts.forEach(s => p.append("sort", `${s.field},${s.direction}`));
  return p;
}

async function fetchData(params: UseCardDataParams): Promise<PageResponse<Pokecards>> {
  const path = params.q && params.q.trim() ? "/cards/search" : "/cards";
  const { data } = await axios.get<PageResponse<Pokecards>>(`${API_URL}${path}`, { params: buildParams(params) });
  return data;
}

export function useCardData(params: UseCardDataParams) {
  return useQuery({
    queryKey: ["cards-data", params],
    queryFn: () => fetchData(params),
    staleTime: 30_000,
    retry: 2,
    placeholderData: (prev) => prev,
  });
}
