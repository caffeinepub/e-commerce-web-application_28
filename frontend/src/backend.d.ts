import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    stockQty: bigint;
    name: string;
    description: string;
    category: Category;
    image: {
        url: string;
        name: string;
        mimeType: string;
    };
    priceUsd: bigint;
}
export type Time = bigint;
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
    unitPrice: bigint;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
    unitPrice: bigint;
}
export interface Order {
    id: bigint;
    status: Status;
    userId: Principal;
    createdAt: Time;
    totalAmount: bigint;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    clothing = "clothing",
    homeKitchen = "homeKitchen",
    electronics = "electronics"
}
export enum Status {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createProduct(name: string, description: string, category: Category, priceUsd: bigint, stockQty: bigint, image: {
        url: string;
        name: string;
        mimeType: string;
    }): Promise<Product>;
    deleteProduct(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getOrder(id: bigint): Promise<Order>;
    getOrderHistory(): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllOrders(): Promise<Array<Order>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(): Promise<Order>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(id: bigint, status: Status): Promise<Order>;
    updateProduct(id: bigint, name: string, description: string, category: Category, priceUsd: bigint, stockQty: bigint, image: {
        url: string;
        name: string;
        mimeType: string;
    }): Promise<Product>;
}
