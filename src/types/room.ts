import type { ReactNode } from "react";

export interface Room {
  description: ReactNode;
  roomId: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  amenities: string;
  isAvailable: boolean;
  imageUrl: string;
  hotelId: number;
  hotelName: string;
  hotelLocation: string;
  hotelCity: string;
  hotelAddress: string;
  hotelContactPhone: string;
}
