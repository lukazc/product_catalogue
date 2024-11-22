export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand?: string;
    sku: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: {
        rating: number;
        comment: string;
        date: string;
        reviewerName: string;
        reviewerEmail: string;
    }[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
    thumbnail: string;
    images: string[];
}

export interface ProductApiResponse {
    limit: number;
    products: Product[];
    skip: number;
    total: number;
}