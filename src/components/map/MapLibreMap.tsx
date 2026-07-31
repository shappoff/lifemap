"use client";

import Map, {
  NavigationControl,
  type MapProps,
  type MapRef,
} from "react-map-gl/maplibre";
import { forwardRef } from "react";
import { MAP_STYLE_POSITRON } from "@/lib/map-styles";

type MapLibreMapProps = Omit<MapProps, "mapStyle"> & {
  mapStyle?: string;
  showNavigation?: boolean;
};

export const MapLibreMap = forwardRef<MapRef, MapLibreMapProps>(
  function MapLibreMap(
    {
      mapStyle = MAP_STYLE_POSITRON,
      showNavigation = true,
      children,
      style,
      ...rest
    },
    ref,
  ) {
    return (
      <Map
        ref={ref}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%", ...style }}
        {...rest}
      >
        {showNavigation ? <NavigationControl position="top-right" /> : null}
        {children}
      </Map>
    );
  },
);
