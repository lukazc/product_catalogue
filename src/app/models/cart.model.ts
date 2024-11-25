/**
 * Represents a local cart.
 */
export interface LocalCart {
    /** The unique identifier of the user. */
    userId: number;
    /** The list of items in the cart. */
    products: LocalCartItem[];
    /** The total price of items in the cart. */
    totalPrice: number;
    /** The total number of products in the cart. */
    totalProducts: number;
    /** The total quantity of items in the cart. */
    totalQuantity: number;
}

/**
 * Represents an item in the local cart.
 */
export interface LocalCartItem {
    /** The unique identifier of the product. */
    id: number;
    /** The quantity of the product in the cart. */
    quantity: number;
    /** The title of the product. */
    title: string;
    /** The price of the product. */
    price: number;
    /** The thumbnail image URL of the product. */
    thumbnail: string;
}