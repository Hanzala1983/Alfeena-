export interface Product {
  id: string;
  code: string; // e.g. "ALF-101"
  title: string;
  category: string;
  originalPrice: number;
  price: number;
  discountPercentage?: number;
  images: string[];
  inStock: boolean;
  stockCount?: number;
  isLimitedStock?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  fabric: {
    kamiz: string; // e.g. "প্রিমিয়াম সুইস কটন / লাক্সারি লন উইথ এমব্রয়ডারি"
    salwar: string; // e.g. "পিওর কটন সলিড ২.৫ গজ"
    dupatta: string; // e.g. "ডিজিটাল প্রিন্টেড সফট অরগেনজা / শিফন"
    work: string; // e.g. "ভারী চিকনকারি ও রেশমি সুতার কাজ"
  };
  description: string;
  sizes?: string[];
  createdAt?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus =
  | 'placed' // ১. অর্ডার গ্রহণ
  | 'confirmed' // ২. কনফার্মড
  | 'packed' // ৩. প্যাকেজিং
  | 'in_transit' // ৪. ট্রানজিট
  | 'out_for_delivery' // ৫. ডেলিভারির পথে
  | 'delivered' // ৬. ডেলিভার্ড
  | 'cancelled';

export interface OrderItem {
  productId: string;
  code: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. "ALF-81771"
  customerName: string;
  mobile: string;
  district: string;
  isInsideDhaka: boolean;
  address: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'cash_on_delivery' | 'bkash' | 'nagad';
  status: OrderStatus;
  courierPartner: string; // e.g. "Steadfast Courier", "Pathao", "RedX"
  courierTrackingCode: string; // e.g. "STF-992140"
  createdAt: string; // ISO string
  updatedAt?: string;
  timelineNotes?: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
}

export interface BrandingConfig {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  noticeBannerText: string;
  helplinePhone: string;
  helplineDisplay: string;
  whatsappNumber: string;
  facebookPageUrl: string;
  insideDhakaShipping: number;
  outsideDhakaShipping: number;
}
