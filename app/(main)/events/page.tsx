"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MapContainer, { MapRef } from "@/features/leaflet-custom/map-container";
import { Marker } from "@/features/leaflet-custom/marker";
import { TileLayer } from "@/features/leaflet-custom/tile-layer";
import { getAllByMemberId } from "@/firebase/firestore/eventsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TEvent } from "@/lib/types";
import { LatLngExpression } from "leaflet";
import React, { useRef } from "react";

const Page: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [events, setEvents] = React.useState<TEvent[]>([]);
  const [positions, setPositions] = React.useState<LatLngExpression[]>([]);
  const ref = useRef<MapRef>(null);

  const fetchEvents = React.useCallback(() => {
    if (user) {
      getAllByMemberId(user.uid).then(({ result }) => {
        if (result) setEvents(result);
      });
    }
  }, [user]);

  React.useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  React.useEffect(() => {
    const latLngMaps = events.map((e) => e.latLng);
    console.log("latLngMaps", latLngMaps);
    const _positions = latLngMaps
      .filter((e) => e !== undefined && typeof e === "string")
      .map((e) => e.split(","))
      .filter(([lat]) => lat && Number(lat))
      .map((e) => e.map((f) => Number(f)))
      .map(([lat, lng]) => [lat, lng] as LatLngExpression);
    setPositions(_positions);
  }, [events]);

  React.useEffect(() => {
    if (ref.current && positions[0]) {
      console.log("flyto", positions[0]);
      ref.current.flyTo(positions[0]);
    }
  }, [positions, ref]);

  const handleFlyTo = (latLng?: string) => {
    if (ref.current && latLng) {
      const [lat, lng] = latLng.split(",");
      if (Number(lat)) {
        ref.current.flyTo([Number(lat), Number(lng)]);
      }
    }
  };

  return (
    <>
      <div className="">
        <h6 className="font-semibold text-lg">Booked Events</h6>
      </div>
      <div className="grid grid-cols-2 py-2 space-x-2 h-full ">
        <div className="flex flex-col space-y-2">
          {events.map(({ id, title, description, datetime, latLng }) => (
            <Card key={id}>
              <CardHeader onClick={() => handleFlyTo(latLng)}>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <CardDescription>{datetime}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="p-2 bg-white border rounded-lg h-full">
          <MapContainer
            ref={ref}
            style={{ height: "100%" }}
            zoom={13}
            center={positions[0] ?? [0, 0]}
            scrollWheelZoom={false}
            doubleClickZoom
            fadeAnimation
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions.map((position) => (
              <Marker key={`${position}`} position={position} />
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default Page;
