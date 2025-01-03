import type { InteractiveLayerOptions, Layer, LayerOptions } from "leaflet";
import { useEffect } from "react";

import { useAttribution } from "./attribution";
import { type LeafletContextInterface, useLeafletContext } from "./context";
import type { ElementHook, LeafletElement } from "./element";
import { type EventedProps, useEventHandlers } from "./events";
import { withPane } from "./pane";

export interface LayerProps extends EventedProps, LayerOptions {}
export interface InteractiveLayerProps
  extends LayerProps,
    InteractiveLayerOptions {}

export function useLayerLifecycle(
  element: LeafletElement<Layer>,
  context: LeafletContextInterface
) {
  useEffect(
    function addLayer() {
      const container = context.layerContainer ?? context.map;
      container.addLayer(element.instance);

      return function removeLayer() {
        context.layerContainer?.removeLayer(element.instance);
        context.map.removeLayer(element.instance);
      };
    },
    [context, element]
  );
}

export function createLayerHook<E extends Layer, P extends LayerProps>(
  useElement: ElementHook<E, P>
) {
  return function useLayer(props: P): ReturnType<ElementHook<E, P>> {
    const context = useLeafletContext();
    const elementRef = useElement(withPane(props, context), context);

    useAttribution(context.map, props.attribution);
    useEventHandlers(elementRef.current, props.eventHandlers);
    useLayerLifecycle(elementRef.current, context);

    return elementRef;
  };
}
