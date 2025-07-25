// ✅ src/types/Hotel.ts

export interface Hotel {
  hotelId: number;
  hotelName: string;
  address: string;
  city: string;
  location: string;
  contactPhone?: string | null;
  category?: string | null;
  rating?: number | null;
  imageUrl: string;
  amenities?: string; // if you use it for HotelDetailsPage
  galleryImages?: string[]; // optional gallery images
}
