// order.interface.ts
export interface Order {
    orderTypes: number;
    isOutOfCityShipping: boolean;
    shippingId: number;
    paymentType: number;
    branch: number;
    region: number;
    city: number;
    totalWeight: number;
    merchantName?: string; // اختياري حسب الدور
    orderCost: number;
    customerName: string;
    customerPhone1: string;
    customerPhone2?: string; // اختياري
    customerAddress: string;
    customerEmail?: string; // اختياري
    products: Product[];
  }
  
  // product.interface.ts
  export interface Product {
    id: number;
    name: string;
    weight: number;
    quantity: number;
    createdAt: string;
    orderId: number;
  }
  
  // merchant.interface.ts
  export interface Merchant {
    id: number;
    name: string;
  }