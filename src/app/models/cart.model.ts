export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
}