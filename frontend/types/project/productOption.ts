export interface ProductOption {
  title: string;
  content: string;
  price: number;
  fileUrl: string | null;
  optionStatus: "AVAILABLE" | "UNAVAILABLE";
  providingMethod: "DOWNLOAD" | "EMAIL" | string;
  purchaseOptionId: number;
}
