import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { BusLocation } from "@/lib/locations";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const makeBusIcon = () => new L.DivIcon({
  html: `<div style="font-size:30px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));transition:none">🚌</div>`,
  iconSize: [34, 34], iconAnchor: [17, 17], className: "",
});

function FitBounds({ pickup, destination }: { pickup: BusLocation; destination: BusLocation }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      L.latLngBounds([pickup.lat, pickup.lng], [destination.lat, destination.lng]),
      { padding: [48, 48] }
    );
  }, [pickup.lat, pickup.lng, destination.lat, destination.lng]);
  return null;
}

/* Smooth-tween bus marker — uses RAF + elapsed time for buttery animation */
function TweenBus({
  pickup, destination, durationMs, isRiding, onComplete,
}: {
  pickup: BusLocation;
  destination: BusLocation;
  durationMs: number;
  isRiding: boolean;
  onComplete: () => void;
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isRiding) {
      if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      completedRef.current = false;
      return;
    }

    completedRef.current = false;
    const icon = makeBusIcon();
    const marker = L.marker([pickup.lat, pickup.lng], { icon, zIndexOffset: 500 }).addTo(map);
    markerRef.current = marker;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / durationMs, 1);

      const lat = pickup.lat + (destination.lat - pickup.lat) * t;
      const lng = pickup.lng + (destination.lng - pickup.lng) * t;
      marker.setLatLng([lat, lng]);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      marker.remove();
      markerRef.current = null;
    };
  }, [isRiding]);

  return null;
}

interface RideMapProps {
  pickup: BusLocation;
  destination: BusLocation;
  isRiding: boolean;
  rideDurationMs: number;
  onRideComplete: () => void;
}

export function RideMap({ pickup, destination, isRiding, rideDurationMs, onRideComplete }: RideMapProps) {
  const center: [number, number] = [
    (pickup.lat + destination.lat) / 2,
    (pickup.lng + destination.lng) / 2,
  ];

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-border shadow-lg"
      style={{ height: 300 }}
    >
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds pickup={pickup} destination={destination} />

        <Marker position={[pickup.lat, pickup.lng]} icon={greenIcon} />
        <Marker position={[destination.lat, destination.lng]} icon={redIcon} />

        <Polyline
          positions={[[pickup.lat, pickup.lng], [destination.lat, destination.lng]]}
          pathOptions={{ color: "#22c55e", weight: 4, dashArray: "10 7", opacity: 0.9 }}
        />

        <TweenBus
          pickup={pickup}
          destination={destination}
          durationMs={rideDurationMs}
          isRiding={isRiding}
          onComplete={onRideComplete}
        />
      </MapContainer>

      <div className="absolute bottom-2 left-2 z-[1000] flex flex-col gap-1 bg-black/70 text-white text-xs rounded-lg px-3 py-2 backdrop-blur-sm pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block shrink-0" />
          <span>{pickup.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block shrink-0" />
          <span>{destination.name}</span>
        </div>
      </div>

      {isRiding && (
        <div className="absolute top-2 right-2 z-[1000] bg-primary text-primary-foreground text-xs font-bold rounded-full px-3 py-1 animate-pulse pointer-events-none">
          Đang chạy…
        </div>
      )}
    </div>
  );
}
