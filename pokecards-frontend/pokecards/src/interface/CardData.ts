export interface Pokecards {
    id?: string;
    name: string;
    image: string;
    price: number;
    rarity: string;
  }
  
  export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; 
  }
  