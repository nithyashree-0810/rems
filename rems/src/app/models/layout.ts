export class Layout {
  id?: number;
  layoutName!: string;
  area?: number;
  noOfPlots?: number;
  phone?: number;
  location?: string;
  address?: string;
  pincode?: number;
  ownerName1?: string;
  ownerName2?: string;
  ownerName3?: string;
  ownerName4?: string;
  ownerName5?: string;
  ownerName6?: string;
  surveyNo?: string;
  dtcpApproved?: boolean;
  reraApproved?: boolean;
  createdDate?: string | Date;  // Add this field
  pdfPath?: string;   // ⭐ ADD THIS
}
