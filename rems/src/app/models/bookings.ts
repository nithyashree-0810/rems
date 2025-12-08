import { Layout } from "./layout";
import { Plot } from "./plot";

export class Booking{

    id?: number;
    plotno!: string;
    layoutName!: string;
    sqft!: number;
    price!: number;
    direction!: string;
    balance!: number;
    customerName!: string;
    mobileNo!: number;
    address!: string;
    pincode!: number;
    aadharNo!: string;
    panNo!: string;
    paidAmount!: number;
}