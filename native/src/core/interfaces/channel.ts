export interface Category {
  id: number;
  name: string;
  name_ar: string;
  channels: Channel[];
}

export interface Channel {
  id: number;
  name: string;
  url: string;
  image: string;
  category_id: number;
  enabled: number;
}

export interface Promo {
  id: number;
  title: string;
  title_ar: string;
  channel_id: number;
  channel_logo: string;
  promo_image: string;
}
