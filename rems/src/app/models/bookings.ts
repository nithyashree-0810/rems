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
  advance2:number;
  advance3:number;
  advance4:number;
  balance: number;
  plotNo: string; 
  address?: string;
  pincode?: number;
  aadharNo?: string;
  panNo?: string;
  status:string;
  regDate:Date;
  regNo:number;
  refundAmount:number;
  mode:string;
}
