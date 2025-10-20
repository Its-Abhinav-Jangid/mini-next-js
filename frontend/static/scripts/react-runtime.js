import React from "react";

// React core exports
export { default as React } from "react";
export const {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  useInsertionEffect,
  useSyncExternalStore,
} = React;

// Client-side rendering APIs
export { hydrateRoot, createRoot } from "react-dom/client";

// Server-side rendering APIs
export {
  renderToString,
  renderToStaticMarkup,
  renderToPipeableStream,
} from "react-dom/server";

export default React;
