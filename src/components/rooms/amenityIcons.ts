import { AirVent, CigaretteOff, ConciergeBell, Droplets, LampDesk, Shirt, Thermometer, Tv, Wifi, Wind, type LucideIcon } from 'lucide-react'
import type { AmenityKey } from '@/data/rooms'

export const AMENITY_ICONS: Record<AmenityKey, LucideIcon> = {
  wifi: Wifi,
  ac: AirVent,
  heating: Thermometer,
  tv: Tv,
  desk: LampDesk,
  wardrobe: Shirt,
  hairdryer: Wind,
  toiletries: Droplets,
  roomService: ConciergeBell,
  nonSmoking: CigaretteOff,
}
