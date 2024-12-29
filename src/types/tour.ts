import { type Address } from '.';

export interface Tour {
  _id?: string;
  title: string;
  photos: string[];
  desc: string;
  price: number;
  maxGroupSize: number;
  hotelId: string;
  status: TourStatus;
  customerIds: string[];
  reviews: Review[];
  startDate: string;
  endDate: string;
  destination: Address;
  departurePoint: Address;
  isDeleted: boolean;
}

export enum TourStatus {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Review {
  tourId: string;
  userId: string;
  reviewText: string;
  rating: number;
}

export interface SearchTour {
  page: number;
  limit: number;
  title?: string;
  groupSize?: string;
  price?: string;
  status?: string;
}

export interface CreateTourForm {
  title: string;
  files: File[] | string[];
  desc: string;
  price: number;
  maxGroupSize: number;
  hotelId: string;
  startDate: string;
  endDate: string;
  destination: Address;
  departurePoint: Address;
}
