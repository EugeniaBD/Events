"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MapContainer, { MapRef } from "@/features/leaflet-custom/map-container";
import { Marker } from "@/features/leaflet-custom/marker";
import { TileLayer } from "@/features/leaflet-custom/tile-layer";
import { getAllByUserId } from "@/firebase/firestore/eventsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TEvent } from "@/lib/types";
import { LatLngExpression } from "leaflet";
import { Edit, MapPinIcon } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

const Page: React.FC = () => {
  const [events, setEvents] = React.useState<TEvent[]>([]);
  const [positions, setPositions] = React.useState<LatLngExpression[]>([]);
  const { user } = useFirebaseAuth();
  const ref = useRef<MapRef>(null);

  React.useEffect(() => {
    if (user) {
      getAllByUserId(user.uid).then((data) => setEvents(data));
    }
  }, [user]);

  React.useEffect(() => {
    const latlngMap = events.map((e) => e.latLng);
    const _positions = latlngMap
      .filter((e) => typeof e === "string")
      .map((e) => e?.split(","))
      .filter((e) => !!e)
      .filter(([lat]) => Number(lat))
      .map(([lat, lng]) => [Number(lat), Number(lng)] as LatLngExpression);
    setPositions(_positions);
  }, [events]);

  React.useEffect(() => {
    console.log("useEffect[positions, ref]", ref, positions[0]);
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
      <div className="flex justify-between">
        <h6 className="text-lg font-bold">Events</h6>
        <Button asChild>
          <Link href="/admin/events/create">Create</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 space-x-2 py-2 h-full">
        <div className="flex flex-col space-y-2">
          {events.map(({ id, title, description, latLng }) => (
            <Card key={id}>
              <CardHeader className="flex flex-row items-start">
                <Link href={`/admin/events/${id}`} className="flex-grow">
                  <CardTitle className="text-2xl">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </Link>
                <div>
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/admin/events/${id}/edit`}>
                      <Edit />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleFlyTo(latLng)}
                  >
                    <MapPinIcon />
                  </Button>
                </div>
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
