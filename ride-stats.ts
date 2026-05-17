import { BusLocation } from "./locations";

function haversineKm(a: BusLocation, b: BusLocation): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sin2 = Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(sin2));
}

export interface RideStats {
  distanceKm: number;
  moneySavedVnd: number;
  co2SavedGrams: number;
}

export function calcRideStats(pickup: BusLocation, dest: BusLocation): RideStats {
  const distanceKm = haversineKm(pickup, dest);

  // Motorbike cost: ~4,500 VND/km (petrol + wear) vs bus flat 9,000 VND
  const motorbikeCost = distanceKm * 4500;
  const busCost = 9000;
  const moneySavedVnd = Math.max(0, Math.round(motorbikeCost - busCost));

  // CO2: motorbike ~110 g/km, bus ~18 g/km per passenger
  const co2SavedGrams = Math.round(distanceKm * (110 - 18));

  return { distanceKm: Math.round(distanceKm * 10) / 10, moneySavedVnd, co2SavedGrams };
}
