interface OrderOption {
  id: number;
  optionName: string;
  price: number;
  providingMethod: "DOWNLOAD";
  downloadExpire: string;
  downloadCount: number;
}

export interface Order {
  orderId: string;
  orderStatus: "ABORTED";
  payType: string;
  paidAmount: number;
  projectType: "DONATION";
  customerName: string;
  customerEmail: string;
  projectTitle: string;
  orderOptions: OrderOption[];
}

export interface OrderResponseData {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Order[];
}
