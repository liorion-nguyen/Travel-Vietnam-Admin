import axios, { type AxiosResponse } from 'axios';
import { envConfig } from '@/config';

import { type SuccessResponse } from '../auth/client';
import { setupAxiosInterceptors } from '../axios-instance';
import { toast } from 'react-toastify';
import { CreateRoomRequestDto, Room, SearchRoomRequestDto, UpdateRoomRequestDto } from '@/types/rooms';

class RoomApi {
  constructor() {
    setupAxiosInterceptors((): Promise<void> => Promise.resolve());
  }

  async searchRooms(params: SearchRoomRequestDto): Promise<{ data?: Room[] | undefined; total?: number; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<{ data: Room[]; total: number }>> = await axios.get(
        `${envConfig.serverURL}/rooms`,
        {
          params,
        }
        );
      return { data: res.data.data?.data, total: res.data.data?.total };
    } catch (error) {
      return { error: 'Discounts not found' };
    }
  }

  async createRoom(formData: CreateRoomRequestDto): Promise<{ data?: Room; error?: string }> {
    try {
      const body = {
        roomNumber: formData.roomNumber,
        description: formData.description,
        roomType: formData.roomType,
        price: formData.price,
        maxOccupancy: formData.maxOccupancy,
        hotelId: formData.hotelId,
        status: formData.status,
      };

      const res: AxiosResponse<SuccessResponse<Room>> = await axios.post(`${envConfig.serverURL}/rooms`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Create room successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.error('Create room failed');
      return { error: 'Failed to create room' };
    }
  }

  async updateRoom(formData: UpdateRoomRequestDto, roomId: string): Promise<{ data?: Room; error?: string }> {
    try {
      const updateRoomDto = {
        roomNumber: formData.roomNumber,
        description: formData.description,
        roomType: formData.roomType,
        price: formData.price,
        maxOccupancy: formData.maxOccupancy,
        hotelId: formData.hotelId,
        status: formData.status,
      }

      const res: AxiosResponse<SuccessResponse<Room>> = await axios.put(
        `${envConfig.serverURL}/rooms/${roomId}`,
        updateRoomDto,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Update room successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.error('Update room failed');
      return { error: 'Failed to update room' };
    }
  }

  async getRoom(roomId: string): Promise<{ data?: Room; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Room>> = await axios.get(`${envConfig.serverURL}/rooms/get-one/${roomId}`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Room not found' };
    }
  }

  async deleteRoom(roomId: string): Promise<{ data?: Room; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Room>> = await axios.delete(`${envConfig.serverURL}/rooms/${roomId}`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Failed to delete room' };
    }
  }
}

export const roomApi = new RoomApi();
