

export class Booking{

   id?: number;

  plotId!: number;   // FK
  plotno!: string;   // plotNo

  layoutName!: string;
  sqft!: number;
  price!: number;
  direction!: string;
  balance!: number;

  customerName!: string;
  mobileNo!: number;
  address!: string;
  pincode!: number;

  aadharNo!: string | null;
  panNo!: string | null;

  paidAmount!: number;
}