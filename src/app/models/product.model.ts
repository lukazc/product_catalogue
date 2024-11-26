/**
 * Represents a product in the catalog.
 */
export interface Product {
    /** The unique identifier of the product. */
    id: number;
    /** The title of the product. */
    title: string;
    /** The description of the product. */
    description: string;
    /** The price of the product. */
    price: number;
    /** The category of the product. */
    category: string;
    /** The discount percentage of the product. */
    discountPercentage?: number;
    /** The rating of the product. */
    rating?: number;
    /** The stock quantity of the product. */
    stock?: number;
    /** The tags associated with the product. */
    tags?: string[];
    /** The brand of the product. */
    brand?: string;
    /** The SKU of the product. */
    sku?: string;
    /** The weight of the product. */
    weight?: number;
    /** The dimensions of the product. */
    dimensions?: {
        /** The width of the product. */
        width: number;
        /** The height of the product. */
        height: number;
        /** The depth of the product. */
        depth: number;
    };
    /** The warranty information of the product. */
    warrantyInformation?: string;
    /** The shipping information of the product. */
    shippingInformation?: string;
    /** The availability status of the product. */
    availabilityStatus?: string;
    /** The reviews of the product. */
    reviews?: {
        /** The rating given in the review. */
        rating?: number;
        /** The comment in the review. */
        comment?: string;
        /** The date of the review. */
        date?: string;
        /** The name of the reviewer. */
        reviewerName?: string;
        /** The email of the reviewer. */
        reviewerEmail?: string;
    }[];
    /** The return policy of the product. */
    returnPolicy?: string;
    /** The minimum order quantity of the product. */
    minimumOrderQuantity?: number;
    /** The metadata of the product. */
    meta?: {
        /** The creation date of the product. */
        createdAt: string;
        /** The last update date of the product. */
        updatedAt?: string;
        /** The barcode of the product. */
        barcode?: string;
        /** The QR code of the product. */
        qrCode?: string;
    };
    /** The thumbnail image URL of the product. */
    thumbnail: string;
    /** The list of image URLs of the product. */
    images: string[];
}

/**
 * Represents the API response for products.
 */
export interface ProductApiResponse {
    /** The limit of products per page. */
    limit: number;
    /** The list of products. */
    products: Product[];
    /** The number of products to skip. */
    skip: number;
    /** The total number of products. */
    total: number;
}