/* eslint-disable complexity */
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';

import {
  GoogleMapsContext,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

function usePolygon(props) {
  const {
    data,
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPaths,
    paths,
    id,
    isSelected,
    claimedColor = "#1EE600",
    reservedColor = "#1EE600",
    claimedOpacity = 0.85,
    reservedOpacity = 0.85,
    ...polygonOptions
  } = props;
  // This is here to avoid triggering the useEffect below when the callbacks change (which happen if the user didn't memoize them)
  const callbacks = useRef({});
  Object.assign(callbacks.current, {
    onClick: (e) => onClick && onClick(e, data),
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut
  });

  const geometryLibrary = useMapsLibrary('geometry');

  const polygon = useRef(new window.google.maps.Polygon()).current;
 
  useMemo(() => {
    polygon.setOptions(polygonOptions);
  }, [polygon, polygonOptions]);

  const map = useContext(GoogleMapsContext)?.map;

  useMemo(() => {

    if (!paths || !geometryLibrary) return;
    polygon.setPaths(paths);

    polygon.setOptions({
      paths: paths,
      strokeColor: "#FFFFFF",
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: data.status === "claimed"
        ? claimedColor
        : data.status === "reserved"
          ? reservedColor
          : "#1EE600",
      fillOpacity: data.status === "claimed"
        ? claimedOpacity
        : data.status === "reserved"
          ? reservedOpacity
          : data.isSelected ? 0.85 : 0.34,
    })
  }, [polygon, paths, data, geometryLibrary]);

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Polygon> has to be inside a Map component.');

      return;
    }

    polygon.setMap(map);

    return () => {
      polygon.setMap(null);
    };
  }, [map]);

  // attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!polygon) return;

    // Add event listeners
    const gme = window.google.maps.event;
    [
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut']
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(polygon, eventName, e => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });

    return () => {
      gme.clearInstanceListeners(polygon);
    };
  }, [polygon]);

  return polygon;
}

/**
 * Component to render a polygon on a map
 */
export const Polygon = forwardRef((props, ref) => {

  const polygon = usePolygon(props);

  useImperativeHandle(ref, () => polygon, []);

  return null;
});
