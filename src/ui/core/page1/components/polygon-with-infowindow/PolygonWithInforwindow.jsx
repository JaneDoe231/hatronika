import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  InfoWindow
} from "@vis.gl/react-google-maps";

import {
  Polygon
} from "ui/core/page1/components/polygon/Polygon";

import
  styles
from "./PolygonWithInforwindow.module.css";

export const PolygonWithInfowindow = ({
  data,
  strokeWeight = 2,
  infowindowHeaderDisabled = true
}) => {

  const infoWindowRef = useRef();

  const [showInfowindow, setShowInfowindow] = useState(false);
  const [infoWindowContent, setInfoWindowContent] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState([0, 0]);

  const onPolygonClick = (e, data) => {

    setInfoWindowPosition(e.latLng);
    setInfoWindowContent(data);
    setShowInfowindow(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoWindowRef.current && !infoWindowRef.current.contains(event.target)) {
        setShowInfowindow(false);
      }
    };

    if (showInfowindow) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfowindow]);

  return (
    <>
      { data.map((pol, index) => {

        return (
          <Polygon
            key={`poly-${index}`}
            data={pol}
            onClick={onPolygonClick}
            strokeWeight={strokeWeight} 
            encodedPaths={[pol.encodedPath]}
          />
        )
      })}
      
      { showInfowindow &&

        <InfoWindow
          headerDisabled={infowindowHeaderDisabled}
          position={infoWindowPosition}
          onCloseClick={() => setShowInfowindow(false)}>
            <div ref={infoWindowRef}>
            <div className={styles.pointInfoContainer} style={{ padding: "10px" }}>
                  <div className={styles.confirmAddressRow} style={{ margin: 0 }}>
                    <div className={styles.confirmAddressIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle opacity="0.1" cx="24" cy="24" r="24" fill="#00BE9C"/>
                        <path d="M19.8864 16.4545V31H15.9375V16.4545H19.8864ZM27.3544 31H21.7578V16.4545H27.2976C28.7938 16.4545 30.0864 16.7457 31.1754 17.3281C32.2692 17.9058 33.112 18.7391 33.7038 19.8281C34.3004 20.9124 34.5987 22.2121 34.5987 23.7273C34.5987 25.2424 34.3028 26.5445 33.7109 27.6335C33.1191 28.7178 32.281 29.5511 31.1967 30.1335C30.1125 30.7112 28.8317 31 27.3544 31ZM25.7067 27.6477H27.2124C27.9321 27.6477 28.5452 27.5317 29.0518 27.2997C29.5632 27.0677 29.9515 26.6676 30.2166 26.0994C30.4865 25.5312 30.6214 24.7405 30.6214 23.7273C30.6214 22.714 30.4841 21.9233 30.2095 21.3551C29.9396 20.7869 29.5419 20.3868 29.0163 20.1548C28.4955 19.9228 27.8563 19.8068 27.0987 19.8068H25.7067V27.6477Z" fill="#00BE9C"/>
                      </svg>
                    </div>
                    <div className={styles.confirmAddressInfo}>
                      {infoWindowContent.id}
                    </div>
                  </div>
                  <div className={styles.confirmAddressRow}>
                    <div className={styles.confirmAddressIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle opacity="0.1" cx="24" cy="24" r="24" fill="#00BE9C"/>
                        <path d="M28.3472 26.4722L27.7911 27.0318C27.7911 27.0318 26.4674 28.361 22.8558 24.7317C19.2441 21.1023 20.5678 19.7731 20.5678 19.7731L20.9173 19.4199C21.7814 18.5527 21.8633 17.1592 21.1092 16.1414L19.5692 14.0623C18.6355 12.8023 16.8327 12.6356 15.7633 13.7103L13.8444 15.6373C13.3152 16.171 12.9607 16.8603 13.0035 17.6262C13.1135 19.5866 13.991 23.8027 18.8848 28.7217C24.0755 33.9371 28.9461 34.1447 30.937 33.9569C31.5677 33.8976 32.1153 33.574 32.5565 33.1293L34.292 31.385C35.4653 30.2078 35.1353 28.188 33.6345 27.3641L31.3 26.0806C30.3149 25.5408 29.1172 25.6989 28.3472 26.4722Z" fill="#00BE9C"/>
                      </svg>
                    </div>
                    <div className={styles.confirmAddressInfo}>
                      {infoWindowContent.phone}
                    </div>
                  </div>
                  <div className={styles.confirmAddressRow}>
                    <div className={styles.confirmAddressIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="24" fill="#ECEDEF"/>
                        <path d="M32 20L24 25L16 20V18L24 23L32 18M32 16H16C14.89 16 14 16.89 14 18V30C14 30.5304 14.2107 31.0391 14.5858 31.4142C14.9609 31.7893 15.4696 32 16 32H32C32.5304 32 33.0391 31.7893 33.4142 31.4142C33.7893 31.0391 34 30.5304 34 30V18C34 17.4696 33.7893 16.9609 33.4142 16.5858C33.0391 16.2107 32.5304 16 32 16Z" fill="#00BE9C"/>
                      </svg>
                    </div>
                    <div className={styles.confirmAddressInfo}>
                      {infoWindowContent.email}
                    </div>
                  </div>
                </div>
            </div>
        </InfoWindow>
      }
    </>
  );
};