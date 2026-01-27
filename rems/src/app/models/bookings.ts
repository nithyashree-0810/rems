export interface Booking {

  bookingId: number;   // backend uses bookingId, NOT id

  // History tracking fields
  createdDate?: string;
  updatedDate?: string;
  isActive?: boolean;
  bookingStatus?: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED' | 'TRANSFERRED';

  plot?: {
    plotId: number;
    plotNo: string;
    sqft: number;
    price: number;
    direction: string;
  };

  layout?: {
    id?: number;
    layoutName: string;
    area?: number;
    noOfPlots?: number;
    location?: string;
    address?: string;
    ownerName1?: string;
    ownerName2?: string;
    ownerName3?: string;
    ownerName4?: string;
    ownerName5?: string;
    ownerName6?: string;
    createdDate?: string;
    pdfPath?: string;
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
  advance1Date: Date | string;
  advance1Mode: string;
  advance2: number;
  advance2Date: Date | string;
  advance2Mode: string;
  advance3: number;
  advance3Date: Date | string;
  advance3Mode: string;
  advance4: number;
  advance4Date: Date | string;
  advance4Mode: string;
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
