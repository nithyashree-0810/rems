import { Layout } from "./layout";

export class Plot {
  plotNo!: string;
  sqft!: number;
  direction!: string;
  totalSqft!: number;
  breadthOne!: number;
  breadthTwo!: number;
  lengthOne!: number;
  lengthTwo!: number;
  price!: number;
  address!: string;
  mobile!: number;
  surveyNo!: string;
  ownerName!: string;
  email!: string;
  layoutAddress?: string;

  // New attributes
  dtcpApproved!: boolean;
  reraApproved!: boolean;
  booked!: boolean;

  // Use Layout object instead of inline object
  layout!: Layout;
}
