export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  
}

export enum BookingType {
  HOTELS = "HOTELS",
  TOURS = "TOURS",
}

export interface SearchBooking {
  page?: number;
  limit?: number;
  amount?: string;
  status?: string;
  bookingType?: string;
}

export interface CreateBookingForm {
  userId: string;
  orderId: string;
  amount: number;
  vnpayCode: string;
  bookingType: BookingType;
  guestSize: number;
}

export interface Booking {
  _id?: string;
  userId: string;
  orderId: string;
  amount: number;
  vnpayCode: string;
  status: BookingStatus;
  bookingType: BookingType;
  guestSize: number;
  isDeleted?: boolean;
}