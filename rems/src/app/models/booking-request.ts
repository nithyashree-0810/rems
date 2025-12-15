export interface BookingRequest {
 plot: { plotId: number };
  plotNo: string;
  layout: { layoutName: string };
  customer: { mobileNo: number };

  sqft: number;
  price: number;
  advance1: number;
  advance2:number;
  advance3:number;
  advance4:number;
  direction: string;
  balance: number;
  address: string;
  pincode: number;
  aadharNo: string | null;
  panNo: string | null;

  status: String;
  regDate:Date;
  regNo:number;
}
