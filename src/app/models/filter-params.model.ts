import { Product } from "./product.model";

export interface FilterParams {
    sortBy?: keyof Product;
    order?: 'asc' | 'desc';
    limit?: number;
    skip?: number;
    select?: keyof Product;
    q?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
}