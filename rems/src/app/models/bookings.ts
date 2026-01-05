export interface Booking {

  bookingId: number;   // backend uses bookingId, NOT id

  plot?: {
    plotId: number;
    plotNo: string;
    sqft: number;
    price: number;
    direction: string;
  };

  layout?: {
    layoutName: string;
  };

  customer?: {
    firstName: string;
    mobileNo: number;
    address: string;
    pincode: number;
    aadharNo: string;
    panNo: string;
  };

  sqft: number;
  price: number;
  direction: string;
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
  balance: number;
  plotNo: string; 
  address?: string;
  pincode?: number;
  aadharNo?: string;
  panNo?: string;
  status:string;
  regDate:Date;
  regNo:number;
  refundedAmount?: number;
remainingRefund?: number;
refundDate?: Date;
refundMode?: string;
}
