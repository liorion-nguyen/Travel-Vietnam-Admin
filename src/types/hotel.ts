import { type Address } from '.';
import { type Review } from './tour';

export interface SearchHotel {
  page?: number;
  limit?: number;
  name?: string;
  maxGroupSize?: string;
  price?: string;
  status?: string;
}

export interface CreateHotelForm {
  name: string;
  files: File[] | string[];
  description: string;
  price: number;
  amenities: string[];
  address: Address;
  startDate: string;
  endDate: string;
}

export interface Hotel {
  _id?: string;
  name?: string;

  address?: Address;

  price?: number;

  reviews?: Review[];

  description?: string;

  amenities?: string[];

  photos: string[];

  maxGroupSize?: number;

  startDate?: string;

  endDate?: string;
}

export interface Room {
  _id?: string;
  hotelId?: string;
  images?: string[];
  roomNumber?: number;
  roomType?: string;
  name?: string;
  price?: number;
  description?: string;
  availability?: boolean;
  maxOccupancy?: number;
}
