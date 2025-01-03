"use client";

import {
  FitBoundsOptions,
  LatLngBoundsExpression,
  Map as LeafletMap,
  MapOptions,
} from "leaflet";
import React, {
  CSSProperties,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  createLeafletContext,
  LeafletContext,
  LeafletContextInterface,
} from "./context";

export type MapRef = LeafletMap | null;

interface MapContainerComponentProps extends MapOptions {
  bounds?: LatLngBoundsExpression;
  boundsOptions?: FitBoundsOptions;
  children?: ReactNode;
  className?: string;
  id?: string;
  placeholder?: ReactNode;
  style?: CSSProperties;
  whenReady?: () => void;
}

const MapContainerComponent = (
  {
    bounds,
    boundsOptions,
    children,
    className,
    id,
    placeholder,
    style,
    whenReady,
    zoom,
    center,
    ...options
  }: MapContainerComponentProps,
  forwardedRef: Ref<MapRef>
) => {
  const [props] = useState({ className, id, style });
  const [context, setContext] = useState<LeafletContextInterface | null>(null);
  const mapInstanceRef = useRef<LeafletMap>();
  useImperativeHandle<MapRef, MapRef>(
    forwardedRef,
    () => context?.map ?? null,
    [context]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: ref callback
  const mapRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null && !mapInstanceRef.current) {
      const map = new LeafletMap(node, options);
      mapInstanceRef.current = map;
      if (center != null && zoom != null) {
        map.setView(center, zoom);
      } else if (bounds != null) {
        map.fitBounds(bounds, boundsOptions);
      }
      if (whenReady != null) {
        map.whenReady(whenReady);
      }
      setContext(createLeafletContext(map));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      context?.map.remove();
    };
  }, [context]);

  const contents = context ? (
    <LeafletContext.Provider value={context}>
      {children}
    </LeafletContext.Provider>
  ) : (
    placeholder ?? null
  );

  return (
    <div {...props} ref={mapRef}>
      {contents}
    </div>
  );
};

MapContainerComponent.displayName = "LeafletMap";

const MapContainer = React.forwardRef<MapRef, MapContainerComponentProps>(
  MapContainerComponent
);

export default MapContainer;
