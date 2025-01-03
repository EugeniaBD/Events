import { DragEndEvent, LatLngExpression } from "leaflet";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMapEvents } from "./hooks";
import { Marker } from "./marker";

type LocationMarkerProps = {
  latLng: LatLngExpression;
  setLatLng: Dispatch<SetStateAction<LatLngExpression>>;
};
const LocationMarker: React.FC<LocationMarkerProps> = ({
  latLng,
  setLatLng,
}) => {
  const [position, setPosition] = useState(latLng);

  const map = useMapEvents({
    click() {
      console.log("useMapEvents.click");
      setLatLng(map.getCenter());
    },
    locationfound(e) {
      console.log("useMapEvent.locationfound");
      setLatLng(position);
      map.flyTo(e.latlng, map.getZoom());
    },
    dblclick() {
      console.log("useMapEvent.dbClick", map.getCenter());
      setLatLng(map.getCenter());
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("event", event);
    map.getCenter();
  };

  const markerEventHandlers = {
    dragend: handleDragEnd,
  };

  useEffect(() => {
    setPosition(latLng);
  }, [latLng]);

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={markerEventHandlers}
      riseOnHover
    />
  );
};

export default LocationMarker;
