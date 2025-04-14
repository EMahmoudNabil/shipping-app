export interface OrderReport {
  id: number;
  status: string; // Status of the Order
  isDeleted: boolean; // Status of the OrderReport
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
  reportDate: string;
}