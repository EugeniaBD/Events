import { TileLayer as LeafletTileLayer, type TileLayerOptions } from "leaflet";
import { LayerProps } from "./layer";
import { createTileLayerComponent } from "./generic";
import { createElementObject } from "./element";
import { withPane } from "./pane";
import { updateGridLayer } from "./grid-layer";

export interface TileLayerProps extends TileLayerOptions, LayerProps {
  url: string;
}

export const TileLayer = createTileLayerComponent<
  LeafletTileLayer,
  TileLayerProps
>(
  function createTileLayer({ url, ...options }, context) {
    const layer = new LeafletTileLayer(url, withPane(options, context));
    return createElementObject(layer, context);
  },
  function updateTileLayer(layer, props, prevProps) {
    updateGridLayer(layer, props, prevProps);

    const { url } = props;
    if (url != null && url !== prevProps.url) {
      layer.setUrl(url);
    }
  }
);
