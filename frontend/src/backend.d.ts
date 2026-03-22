import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LineItem {
    nameSnapshot: string;
    unitPriceSnapshot: number;
    productId: bigint;
    quantity: bigint;
}
export interface CreateOrderInput {
    deliveryAddress: string;
    items: Array<LineItem>;
    contactPhone: string;
}
export interface Order {
    status: OrderStatus;
    deliveryAddress: string;
    createdAt: bigint;
    orderId: bigint;
    userPrincipal: Principal;
    items: Array<LineItem>;
    contactPhone: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    availability: boolean;
    imageUrl?: string;
    category: string;
    price: number;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    outForDelivery = "outForDelivery",
    placed = "placed",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(input: CreateOrderInput): Promise<bigint>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: bigint): Promise<Order>;
    getOrderStatus(orderId: bigint): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initProducts(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, newStatus: OrderStatus): Promise<void>;
}
