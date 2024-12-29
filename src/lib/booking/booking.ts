import axios, { type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import { envConfig } from '@/config';

import { type SuccessResponse } from '../auth/client';
import { setupAxiosInterceptors } from '../axios-instance';
import { Booking, CreateBookingForm, SearchBooking } from '@/types/booking';

class BookingApi {
  constructor() {
    setupAxiosInterceptors((): Promise<void> => Promise.resolve());
  }

  async searchBookings(params: SearchBooking): Promise<{ data?: Booking[] | undefined; total?: number; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<{ data: Booking[]; total: number }>> = await axios.get(
        `${envConfig.serverURL}/bookings/search`,
        {
          params,
        }
      );
      return { data: res.data.data?.data, total: res.data.data?.total };
    } catch (error) {
      return { error: 'Booking not found' };
    }
  }

  async createBooking(formData: CreateBookingForm): Promise<{ data?: Booking; error?: string }> {
    try {
      const form = new FormData();

      form.append('userId', formData.userId);
      form.append('orderId', formData.orderId);
      form.append('amount', formData.amount.toString());
      form.append('vnpayCode', formData.vnpayCode);
      form.append('bookingType', formData.bookingType);
      form.append('guestSize', formData.guestSize.toString());

      const res: AxiosResponse<SuccessResponse<Booking>> = await axios.post(`${envConfig.serverURL}/bookings`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Create booking successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.success('Create booking failed');
      return { error: 'Failed to create booking' };
    }
  }

  async updateBooking(formData: CreateBookingForm, bookingId: string): Promise<{ data?: Booking; error?: string }> {
    try {
      const form = new FormData();
      form.append('userId', formData.userId);
      form.append('orderId', formData.orderId);
      form.append('amount', formData.amount.toString());
      form.append('vnpayCode', formData.vnpayCode);
      form.append('bookingType', formData.bookingType);
      form.append('guestSize', formData.guestSize.toString());

      const res: AxiosResponse<SuccessResponse<Booking>> = await axios.put(
        `${envConfig.serverURL}/bookings/${bookingId}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Update booking successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.error('Update booking failed');
      return { error: 'Failed to update booking' };
    }
  }

  async getBooking(bookingId: string): Promise<{ data?: Booking; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Booking>> = await axios.get(`${envConfig.serverURL}/bookings/get/${bookingId}`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Booking not found' };
    }
  }

  async deleteBooking(bookingId: string): Promise<void> {
    try {
      await axios.delete(`${envConfig.serverURL}/bookings/${bookingId}`);
    } catch (error) {
      throw new Error('Failed to delete booking');
    }
  }
}

export const bookingApi = new BookingApi();
