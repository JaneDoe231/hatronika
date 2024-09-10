import
  React, {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = ({
  lat,
  lng,
  infowindowContent,
  infowindowHeaderDisabled = false,
  markerColor = "#1EE600",
  onMarkerClick = () => {}
}) => {

  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const infoWindowRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoWindowRef.current && !infoWindowRef.current.contains(event.target)) {
        setInfowindowOpen(false);
      }
    };

    if (infowindowOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [infowindowOpen]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => {
          setInfowindowOpen(true);
          onMarkerClick(markerRef);
        }}
        position={{lat: lat, lng: lng}}
      >
        <svg style={{ height: '15px', width: '15px' }} xmlns="http://www.w3.org/2000/svg" fill={markerColor} height="24px" width="24px" viewBox="0 0 184.751 184.751" space="preserve" stroke={markerColor}>
          <g strokeWidth="0"/>
          <g strokeLinecap="round" strokeLinejoin="round"/>
          <g><path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z"/></g>
        </svg>
      </AdvancedMarker>

      {infowindowOpen && (
        <InfoWindow
          headerDisabled={infowindowHeaderDisabled}
          anchor={marker}
          onCloseClick={() => setInfowindowOpen(false)}>
          <div ref={infoWindowRef}>
            {infowindowContent}
          </div>
        </InfoWindow>
      )}
    </>
  );
};