export interface LocalCart {
    userId: number;
    products: LocalCartItem[];
    totalPrice: number;
    totalProducts: number;
    totalQuantity: number;
}

export interface LocalCartItem {
    productId: number;
    quantity: number;
    title: string;
    price: number;
    thumbnail: string;
}