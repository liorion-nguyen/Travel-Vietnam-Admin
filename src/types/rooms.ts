export enum RoomType {
  STANDARD = "standard",
  DELUXE = "deluxe",
}

export interface SearchRoom {
  page?: number;
  limit?: number;
  roomNumber?: number;
  roomType?: RoomType | '';
  price?: number;
}

export interface Room {
  _id?: string;
  roomNumber?: number;
  price?: number;
  roomType?: RoomType | '';
  description?: string;
  maxOccupancy?: number;
  hotelId?: string;
  status?: boolean;
  hotelName?: string;
}

export interface CreateRoomRequestDto {
  roomNumber: number;
  price: number;
  roomType: RoomType | '';
  description: string;
  maxOccupancy: number;
  hotelId: string;
  status: boolean;
  hotelName: string;
}

export interface UpdateRoomRequestDto extends Partial<CreateRoomRequestDto> {}

export interface SearchRoomRequestDto {
  roomNumber?: number;
  roomType?: RoomType | '';
  price?: number;
  limit?: number;
  page?: number;
}