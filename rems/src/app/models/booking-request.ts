export interface BookingRequest {
 plot: { plotId: number };
  plotNo: string;
  layout: { layoutName: string };
  customer: { mobileNo: number };

  sqft: number;
  price: number;
  advance1: number;
  advance1Date:Date;
  advance1Mode:string;
  advance2:number;
  advance2Date:Date;
  advance2Mode:string;
  advance3:number;
  advance3Date:Date;
  advance3Mode:string;
  advance4:number;
  advance4Date:Date;
  advance4Mode:string;
  direction: string;
  balance: number;
  address: string;
  pincode: number;
  aadharNo: string | null;
  panNo: string | null;

  status: String;
  regDate:Date;
  regNo:number;
  refundedAmount?: number;      // already refunded
  refundNow?: number;           // current refund
  remainingRefund?: number;     // balance - refunded
  refundDate?: Date;
  refundMode?: string;
}
