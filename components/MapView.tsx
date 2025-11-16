"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { LatLngExpression } from "leaflet";

let L: any;
let MapContainer: any;
let TileLayer: any;
let Marker: any;
let Popup: any;
let useMap: any;

if (typeof window !== "undefined") {
  L = require("leaflet");
  const ReactLeaflet = require("react-leaflet");
  MapContainer = ReactLeaflet.MapContainer;
  TileLayer = ReactLeaflet.TileLayer;
  Marker = ReactLeaflet.Marker;
  Popup = ReactLeaflet.Popup;
  useMap = ReactLeaflet.useMap;

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  if (typeof window === "undefined" || !useMap) return null;
  
  function InnerController() {
    const map = useMap();
    
    useEffect(() => {
      if (map) {
        map.setView(center, zoom);
      }
    }, [center, zoom, map]);
    
    return null;
  }
  
  return <InnerController />;
}

function createCustomIcon(color: string) {
  if (!L) return undefined;
  
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.5 12.5 28.5 12.5 28.5S25 23 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });
}

type Location = {
  id: string;
  name: string;
  description?: string;
  coordinates: [number, number];
  category: string;
  address?: string;
  icon?: string;
  color?: string;
};

type MapViewProps = {
  center: [number, number];
  zoom: number;
  locations: Location[];
};

const MapViewComponent = ({ center, zoom, locations }: MapViewProps) => {
  if (typeof window === "undefined" || !MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom={true}
      className="rounded-xl"
    >
      <MapController center={center} zoom={zoom} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {locations.map((location) => {
        const [lng, lat] = location.coordinates;
        const icon = createCustomIcon(location.color || "#E74C3C");
        
        return (
          <Marker
            key={location.id}
            position={[lat, lng] as LatLngExpression}
            icon={icon}
          >
            <Popup>
              <div className="text-white">
                <h3 className="font-semibold text-sm mb-1">{location.name}</h3>
                {location.description && (
                  <p className="text-xs text-gray-300 mb-1">{location.description}</p>
                )}
                {location.address && (
                  <p className="text-xs text-gray-400">{location.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(MapViewComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-500">
      <div className="text-center">
        <p className="text-sm">Carregando mapa...</p>
      </div>
    </div>
  ),
});
