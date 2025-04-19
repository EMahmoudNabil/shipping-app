export interface OrderReport {
  id: number;
  orderStatus: string;
  merchantName: string;
  customerName: string;
  customerPhone1: string;
  regionName: string;
  branchName: string;
  orderCost: number;
  amountReceived: number;
  shippingCost: number;
  shippingCostPaid: number;
  companyValue: number;
  reportDate: string; // ISO date format
}