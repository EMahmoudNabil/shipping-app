// order.interface.ts
// export interface Order {
//     orderTypes: number;
//     isOutOfCityShipping: boolean;
//     shippingId: number;
//     paymentType: number;
//     branch: number;
//     region: number;
//     city: number;
//     totalWeight: number;
//     merchantName?: string; // اختياري حسب الدور
//     orderCost: number;
//     customerName: string;
//     customerPhone1: string;
//     customerPhone2?: string; // اختياري
//     customerAddress: string;
//     customerEmail?: string; // اختياري
//     products: Product[];
//   }
  
  // product.interface.ts
  // export interface Product {
  //   id: number;
  //   name: string;
  //   weight: number;
  //   quantity: number;
  //   createdAt: string;
  //   orderId: number;
  // }
  
  // merchant.interface.ts
  // export interface Merchant {
  //   id: number;
  //   name: string;
  // }

  import { OrderStatus } from "./OrderStatus.Interface";

  export interface Order {
    id?: number;
    orderTypes: number;
    isOutOfCityShipping: boolean;
    shippingId: number;
    paymentType: number;
    branch: number;
    region: number;
    city: number;
    totalWeight: number;
    merchantName?: string;
    orderCost: number;
    shippingCost?: number;
    customerName: string;
    customerPhone1: string;
    customerPhone2?: string;
    customerAddress: string;
    customerEmail?: string;
    status?: OrderStatus;
    products: OrderProduct[];
    createdAt?: Date;
    employeeId?: string;
    courierId?: string;
  }
  
  export interface OrderProduct {
    id?: number;
    orderId?: number;
    name: string;
    weight: number;
    quantity: number;
  }
  
  export interface OrderWithProductsDto {
    orderTypes: any;
    paymentType: any;
    id: number;
    createdAt: string;
    notes: string | null;
    status: OrderStatus;
    branch: string;
    region: string;
    city: string;
    customerInfo: string;
    merchantName: string;
    isDeleted: boolean;
    shippingCost: number;
    orderCost: number;
    totalWeight: number;
    isOutOfCityShipping: boolean;
    shippingId: number;
    employeeId?: string;
    courierId?: string;
    products: OrderProduct[];
    selected?: boolean; // Add this property
  }
  
  export interface UpdateOrder {
    id: number;
    createdAt: string;
    notes: string | null;
    status: OrderStatus;
    branch: string;
    region: string;
    city: string;
    orderCost: number;
    customerInfo: string;
    merchantName: string;
    orderTypes: number;
    isOutOfCityShipping: boolean;
    shippingId: number;
    paymentType: number;
    totalWeight: number;
    products: OrderProduct[];
    name: string;
  }

  

