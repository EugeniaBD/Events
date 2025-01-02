"use client";

import { cn } from "@/lib/utils";
import { LatLngExpression, map, tileLayer } from "leaflet";
import React from "react";

type LeafletMap = React.HTMLAttributes<HTMLDivElement> & {
  latlng?: LatLngExpression;
};

const LeafletMap: React.FC<LeafletMap> = React.memo(
  ({ latlng, className, ...props }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
      console.log("ref", ref);
      if (!ref?.current) {
        return;
      }
      try {
        const _map = map(ref.current).setView(latlng || [0, 0], 13);
        tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(_map);
      } catch (e) {
        console.log("e", e);
      }
    }, [ref, latlng]);

    return (
      <div
        ref={ref}
        {...props}
        className={cn(className, "overflow-hidden")}
        style={{ height: "180px" }}
      ></div>
    );
  },
  (prev, next) => prev === next
);

LeafletMap.displayName = "LeafletMap";

export default LeafletMap;
