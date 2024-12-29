import axios, { type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import { type CreateTourForm, type SearchTour, type Tour } from '@/types/tour';
import { envConfig } from '@/config';

import { type SuccessResponse } from '../auth/client';
import { setupAxiosInterceptors } from '../axios-instance';
import { blobToFile, convertAndAppendFiles } from '../blob-to-file';

class TourApi {
  constructor() {
    setupAxiosInterceptors((): Promise<void> => Promise.resolve());
  }

  async searchTours(params: SearchTour): Promise<{ data?: Tour[] | undefined; total?: number; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<{ data: Tour[]; total: number }>> = await axios.get(
        `${envConfig.serverURL}/tours/search`,
        {
          params,
        }
      );
      return { data: res.data.data?.data, total: res.data.data?.total };
    } catch (error) {
      return { error: 'Tour not found' };
    }
  }

  async createTour(formData: CreateTourForm): Promise<{ data?: Tour; error?: string }> {
    try {
      const form = new FormData();

      form.append('title', formData.title);
      form.append('desc', formData.desc);
      form.append('price', formData.price.toString());
      form.append('maxGroupSize', formData.maxGroupSize.toString());
      form.append('hotelId', formData.hotelId);
      form.append('startDate', formData.startDate);
      form.append('endDate', formData.endDate);

      form.append('destination[province]', formData.destination.province);
      form.append('destination[district]', formData.destination.district);
      form.append('destination[ward]', formData.destination.ward);
      form.append('departurePoint[province]', formData.departurePoint.province);
      form.append('departurePoint[district]', formData.departurePoint.district);
      form.append('departurePoint[ward]', formData.departurePoint.ward);

      await Promise.all(
        formData.files.map(async (file, index) => {
          const fileObj = await blobToFile(file as string, `image${index}`)
          form.append('files', fileObj);
        })
      );

      const res: AxiosResponse<SuccessResponse<Tour>> = await axios.post(`${envConfig.serverURL}/tours`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Create tour successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.success('Create tour failed');
      return { error: 'Failed to create tour' };
    }
  }

  async updateTour(formData: CreateTourForm, tourId: string): Promise<{ data?: Tour; error?: string }> {
    try {
      const form = new FormData();

      form.append('title', formData.title);
      form.append('desc', formData.desc);
      form.append('price', formData.price.toString());
      form.append('maxGroupSize', formData.maxGroupSize.toString());
      form.append('hotelId', formData.hotelId);
      form.append('startDate', formData.startDate);
      form.append('endDate', formData.endDate);

      form.append('destination[province]', formData.destination.province);
      form.append('destination[district]', formData.destination.district);
      form.append('destination[ward]', formData.destination.ward);
      form.append('departurePoint[province]', formData.departurePoint.province);
      form.append('departurePoint[district]', formData.departurePoint.district);
      form.append('departurePoint[ward]', formData.departurePoint.ward);

      await Promise.all([convertAndAppendFiles(formData?.files as string[], form)]);

      const res: AxiosResponse<SuccessResponse<Tour>> = await axios.put(
        `${envConfig.serverURL}/tours/${tourId}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Update tour successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.error('Update tour failed');
      return { error: 'Failed to create tour' };
    }
  }

  async getTour(tourId: string): Promise<{ data?: Tour; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Tour>> = await axios.get(`${envConfig.serverURL}/tours/get/${tourId}`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Tour not found' };
    }
  }

  async deleteTour(tourId: string): Promise<void> {
    try {
      await axios.delete(`${envConfig.serverURL}/tours/${tourId}`);
    } catch (error) {
      throw new Error('Failed to delete tour');
    }
  }
}

export const tourApi = new TourApi();
