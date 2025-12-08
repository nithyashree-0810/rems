import { Layout } from "./layout";

export class Plot{

   plotNo!: string;
  sqft!: number;
  direction!: string;
  totalSqft!: number;
  breadthOne!: number;
  breadthTwo!: number 
  lengthOne!: number;
  lengthTwo!: number;
  price!: number;
  address!: string;
  mobile!: number;
  ownerName!: string;
  email!: string;
  layout!: {
    layoutName: string;
  };
}