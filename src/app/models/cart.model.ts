export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    title: string;
    price: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
}

export interface Cart {
    id: number;
    userId: number;
    products: CartItem[];
    total: number;
    discountedTotal: number;
    totalProducts: number;
    totalQuantity: number;
}

export interface LocalCart {
    userId: number;
    products: CartItem[];
    totalPrice: number;
    totalProducts: number;
    totalQuantity: number;
}