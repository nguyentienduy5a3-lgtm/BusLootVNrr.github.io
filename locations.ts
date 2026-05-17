export interface BusLocation {
  name: string;
  lat: number;
  lng: number;
}

export const BUS_LOCATIONS: Record<string, BusLocation> = {
  "Giáp Bát": { name: "Giáp Bát", lat: 20.9797, lng: 105.8412 },
  "Cổ Nhuế": { name: "Cổ Nhuế", lat: 21.0666, lng: 105.7756 },
  "Mỹ Đình": { name: "Mỹ Đình", lat: 21.0278, lng: 105.7794 },
  "Bờ Hồ": { name: "Bờ Hồ", lat: 21.0285, lng: 105.8542 },
  "Cát Linh": { name: "Cát Linh", lat: 21.0276, lng: 105.8409 },
  "Nội Bài": { name: "Nội Bài", lat: 21.2212, lng: 105.8074 },
};
