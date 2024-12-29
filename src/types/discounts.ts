export enum DiscountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export enum DiscountType {
  TOUR = 'TOUR',
  HOTEL = 'HOTEL'
}

export interface SearchDiscount {
  page?: number;
  limit?: number;
  name?: string;
  code?: string;
  type?: DiscountType | '';
  value?: number;
}

export interface Discount {
  _id: string;
  code: string;
  description: string;
  value: number;
  type: DiscountType;
  min_order_value?: number;
  max_discount_value?: number;
  startDate: Date;
  endDate: Date;
  usage_limit?: number;
  used_count?: number;
  status?: DiscountStatus;
}

export interface CreateDiscountRequestDto {
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  min_order_value?: number;
  max_discount_value?: number;
  startDate: string;
  endDate: string;
}

export interface UpdateDiscountRequestDto extends Partial<CreateDiscountRequestDto> {
  usage_limit?: number;
  used_count?: number;
  status?: boolean;
}

export interface SearchDiscountRequestDto {
  code?: string;
  type?: DiscountType;
  value?: number;
  limit?: number;
  page?: number;
}