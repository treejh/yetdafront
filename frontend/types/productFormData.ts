export interface ProductImage {
  file?: File;
  previewUrl: string;
}
type DeliveryMethod = "FILE_UPLOAD" | "EMAIL_SEND";
export interface ProductFormData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  price: string;
  images: ProductImage[];
  options: {
    name: string;
    price: string;
    description: string;
    file?: File;
    deliveryMethod: DeliveryMethod;
  }[];
  creatorName: string;
  creatorBio: string;
  creatorAvatar: string;
}
