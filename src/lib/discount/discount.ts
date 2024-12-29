import axios, { type AxiosResponse } from 'axios';
import { envConfig } from '@/config';

import { type SuccessResponse } from '../auth/client';
import { setupAxiosInterceptors } from '../axios-instance';
import { toast } from 'react-toastify';
import { CreateDiscountRequestDto, Discount, SearchDiscountRequestDto, UpdateDiscountRequestDto } from '@/types/discounts';

class DiscountApi {
  constructor() {
    setupAxiosInterceptors((): Promise<void> => Promise.resolve());
  }

  async searchDiscounts(params: SearchDiscountRequestDto): Promise<{ data?: Discount[] | undefined; total?: number; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<{ data: Discount[]; total: number }>> = await axios.get(
        `${envConfig.serverURL}/discounts/search`,
        {
          params,
        }
        );
      return { data: res.data.data?.data, total: res.data.data?.total };
    } catch (error) {
      return { error: 'Discounts not found' };
    }
  }

  async createDiscount(formData: CreateDiscountRequestDto): Promise<{ data?: Discount; error?: string }> {
    try {
      const body = {
        code: formData.code,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        startDate: formData.startDate,
        endDate: formData.endDate,
        min_order_value: formData.min_order_value || null,
        max_discount_value: formData.max_discount_value || null,
      };

      const res: AxiosResponse<SuccessResponse<Discount>> = await axios.post(`${envConfig.serverURL}/discounts`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Create discount successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.success('Create discount failed');
      return { error: 'Failed to create discount' };
    }
  }

  async updateDiscount(formData: UpdateDiscountRequestDto, discountId: string): Promise<{ data?: Discount; error?: string }> {
    try {
      const form = new FormData();

      form.append('code', formData.code || '');
      form.append('description', formData.description || '');
      form.append('type', formData.type || '');
      form.append('value', formData.value?.toString() || '');
      form.append('startDate', formData.startDate || '');
      form.append('endDate', formData.endDate || '');
      form.append('min_order_value', formData.min_order_value?.toString() || '');
      form.append('max_discount_value', formData.max_discount_value?.toString() || '');

      const res: AxiosResponse<SuccessResponse<Discount>> = await axios.put(
        `${envConfig.serverURL}/discounts/${discountId}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Update discount successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.error('Update discount failed');
      return { error: 'Failed to update discount' };
    }
  }

  async getDiscount(discountId: string): Promise<{ data?: Discount; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Discount>> = await axios.get(`${envConfig.serverURL}/discounts/${discountId}`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Discount not found' };
    }
  }

  async deleteDiscount(discountId: string): Promise<{ data?: Discount; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Discount>> = await axios.delete(`${envConfig.serverURL}/discounts/${discountId}`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Failed to delete discount' };
    }
  }
}

export const discountApi = new DiscountApi();
