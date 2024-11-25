import { Product } from "./product.model";

/**
 * Represents the filter parameters for product queries.
 */
export interface FilterParams {
    /** The field to sort by. */
    sortBy?: keyof Product;
    /** The order of sorting. */
    order?: 'asc' | 'desc';
    /** The limit of products per page. */
    limit?: number;
    /** The number of products to skip. */
    skip?: number;
    /** The fields to select in the response. */
    select?: string;
    /** The search query. */
    q?: string;
    /** The category to filter by. */
    category?: string;
    /** The minimum price to filter by. */
    priceMin?: number;
    /** The maximum price to filter by. */
    priceMax?: number;
}