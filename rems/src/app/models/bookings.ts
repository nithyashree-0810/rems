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
  paidAmount: number;
  balance: number;
  plotNo: string; 
  status:string;
  regDate:Date;
  regNo:number;
}
