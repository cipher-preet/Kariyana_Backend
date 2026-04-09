export interface SearchQuery {
  q?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  brand?: string;
  sort?: string;
}