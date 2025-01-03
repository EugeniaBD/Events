import React, {
  type PropsWithoutRef,
  type ReactNode,
  type Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  MutableRefObject,
} from "react";
import { createPortal } from "react-dom";

import { LeafletContext } from "./context";
import type { DivOverlay, DivOverlayHook } from "./div-overlay";
import type { LeafletElement } from "./element";

type ElementHook<E, P> = (props: P) => MutableRefObject<LeafletElement<E>>;

export type PropsWithChildren = PropsWithoutRef<{
  children?: ReactNode;
}>;

export function createContainerComponent<E, P extends PropsWithChildren>(
  useElement: ElementHook<E, PropsWithoutRef<P>>
) {
  function ContainerComponent(props: PropsWithoutRef<P>, forwardedRef: Ref<E>) {
    const { instance, context } = useElement(props).current;
    useImperativeHandle(forwardedRef, () => instance);

    const { children } = props as PropsWithChildren;
    return children == null ? null : (
      <LeafletContext.Provider value={context}>
        {children}
      </LeafletContext.Provider>
    );
  }

  return forwardRef(ContainerComponent);
}

export function createDivOverlayComponent<
  E extends DivOverlay,
  P extends PropsWithChildren
>(useElement: ReturnType<DivOverlayHook<E, PropsWithoutRef<P>>>) {
  function OverlayComponent(props: PropsWithoutRef<P>, forwardedRef: Ref<E>) {
    const [isOpen, setIsOpen] = useState(false);
    const { instance } = useElement(props, setIsOpen).current;

    useImperativeHandle(forwardedRef, () => instance);
    // biome-ignore lint/correctness/useExhaustiveDependencies: update overlay when children change
    useEffect(
      function updateOverlay() {
        if (isOpen) {
          instance.update();
        }
      },
      [instance, isOpen, props.children]
    );

    // @ts-expect-error missing in type definition
    const contentNode = instance._contentNode;
    return contentNode ? createPortal(props.children, contentNode) : null;
  }

  return forwardRef(OverlayComponent);
}

export function createLeafComponent<E, P>(
  useElement: ElementHook<E, PropsWithoutRef<P>>
) {
  function LeafComponent(props: PropsWithoutRef<P>, forwardedRef: Ref<E>) {
    const { instance } = useElement(props).current;
    useImperativeHandle(forwardedRef, () => instance);

    return null;
  }

  return forwardRef(LeafComponent);
}
