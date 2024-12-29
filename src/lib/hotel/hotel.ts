import axios, { type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import type { CreateHotelForm, Hotel, Room, SearchHotel } from '@/types/hotel';
import { envConfig } from '@/config';

import { type SuccessResponse } from '../auth/client';
import { setupAxiosInterceptors } from '../axios-instance';
import { blobToFile, convertAndAppendFiles } from '../blob-to-file';

class HotelApi {
  constructor() {
    setupAxiosInterceptors((): Promise<void> => Promise.resolve());
  }

  async searchHotels(params: SearchHotel): Promise<{ data?: Hotel[] | undefined; total?: number; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<{ data: Hotel[]; total: number }>> = await axios.get(
        `${envConfig.serverURL}/hotels/search`,
        {
          params,
        }
      );
      return { data: res.data.data?.data, total: res.data.data?.total };
    } catch (error) {
      return { error: 'Hotels not found' };
    }
  }

  async createHotel(formData: CreateHotelForm): Promise<{ data?: Hotel; error?: string }> {
    try {
      const form = new FormData();

      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price.toString());
      form.append('startDate', formData.startDate);
      form.append('endDate', formData.endDate);
      formData.amenities.forEach((amenity) => {
        form.append('amenities[]', amenity);
      });
      form.append('address[province]', formData.address.province);
      form.append('address[district]', formData.address.district);
      form.append('address[ward]', formData.address.ward);

      await Promise.all(
        formData.files.map(async (file, index) => {
          const fileObj = await blobToFile(file as string, `image${index}`);
          form.append('files', fileObj);
        })
      );

      const res: AxiosResponse<SuccessResponse<Hotel>> = await axios.post(`${envConfig.serverURL}/hotels`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Create hotel successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.success('Create hotel failed');
      return { error: 'Failed to create hotel' };
    }
  }

  async updateHotel(formData: CreateHotelForm, hotelId: string): Promise<{ data?: Hotel; error?: string }> {
    try {
      const form = new FormData();

      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price.toString());
      form.append('startDate', formData.startDate);
      form.append('endDate', formData.endDate);

      form.append('address[province]', formData.address.province);
      form.append('address[district]', formData.address.district);
      form.append('address[ward]', formData.address.ward);

      await Promise.all([convertAndAppendFiles(formData?.files as string[], form)]);

      const res: AxiosResponse<SuccessResponse<Hotel>> = await axios.put(
        `${envConfig.serverURL}/hotels/${hotelId}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Update hotel successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.error('Update hotel failed');
      return { error: 'Failed to update hotel' };
    }
  }

  async getHotel(hotelId: string): Promise<{
    data?: {
      hotel: Hotel;
      rooms: Room[];
    };
    error?: string;
  }> {
    try {
      const res: AxiosResponse<
        SuccessResponse<{
          hotel: Hotel;
          rooms: Room[];
        }>
      > = await axios.get(`${envConfig.serverURL}/hotels/${hotelId}`);
      return {
        data: res.data.data,
      };
    } catch (error) {
      return { error: 'Hotel not found' };
    }
  }

  async searchHotelName(): Promise<{ data?: { id: string; name: string }[]; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<{ id: string; name: string }[]>> = await axios.get(`${envConfig.serverURL}/hotels/name`);
      return { data: res.data.data };
    } catch (error) {
      return { error: 'Hotel name not found' };
    }
  }
}

export const hotelApi = new HotelApi();
