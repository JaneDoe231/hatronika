import {
  useEffect,
  useState
} from 'react';

import {
  Map,
  useMap
} from '@vis.gl/react-google-maps';

import {
  areNeighborCells
} from "h3-js";

import {
  Button
} from '../button/Button';

import {
  LocationSearchBar
} from '../map/location-search-bar/LocationSearchBar';

import {
  Polygon
} from '../map/polygon/Polygon';

import {
  MapApi
} from 'api';

import
  styles
from './ServiceCenterMapSelect.module.css';

export const ServiceCenterMapSelect = ({
  showLoader = () => {},
  hideLoader = () => {}
}) => {

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hexagons, setHexagons] = useState([]);
  const [selectedHexagons, setSelectedHexagons] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const map = useMap();

  const onSearchLocationChange = (place) => {

		if (place.geometry?.viewport) {

      map.panTo(place.geometry.location);
      map.setZoom(12);

			place.coords = {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng()
			};

			setSelectedPlace(place);
    }
	};

  const onRemoveZone = (hexId) => {

    const hexs = hexagons;

    for (let i = 0; i < hexs.length; i++) {

      if (hexs[i].h3_index === hexId) {

        hexs[i] = {
          ...hexs[i],
          isSelected: false
        }

        setSelectedHexagons(selectedHexagons.filter(id => id !== hexId));
        break;
      }
    }

    setHexagons([...hexs]);
  };

  const onHexagonClick = (e, data) => {

    if (!data || data.status === "claimed" || data.satus === "reserved") {
      return;
    }

    if (!data.isSelected && selectedHexagons.length >= 7) {
      return;
    }

    if (!data.isSelected && selectedHexagons.length > 0) {

      const areNeighbors = selectedHexagons.find(h => areNeighborCells(h, data.h3_index));

      if (!areNeighbors) {
        return;
      }
    }

    const hexs = hexagons;

    for (let i = 0; i < hexs.length; i++) {

      if (hexs[i].id === data.id) {

        const newValue = !hexs[i].isSelected;

        hexs[i] = {
          ...hexs[i],
          isSelected: newValue
        }

        if (!newValue) {
          setSelectedHexagons(selectedHexagons.filter(id => id !== data.h3_index));
        }
        else {
          const selectedList = selectedHexagons;
          selectedList.push(data.h3_index);
          setSelectedHexagons(selectedList);
        }

        break;
      }
    }

    setHexagons([...hexs]);
  };

  useEffect(() => {

    if (!selectedPlace?.coords) {
      return;
    }

    showLoader();

    MapApi.getZonesByLocation(selectedPlace.coords.lat, selectedPlace.coords.lng)
      .then(ret => {

        if (ret.ok) {
          setHexagons(ret.data || []);
          return;
        }
        
        throw Error("Unable to get hexagon data");
      })
      .catch(e => console.log(e))
      .finally(() => hideLoader());

  }, [selectedPlace])

  return (
    <>

      <Map
				clickableIcons={false}
				style={{
					userSelect: "none",
					outline: "none"
				}}
				mapId={"b9e443513213961d"}
				disableDefaultUI={true}
				defaultZoom={6}
				defaultCenter={{ lat: -28.2125, lng: 24.0690 }}>

        { hexagons.map((hex, index) =>

            <Polygon
              key={index}
              data={hex}
              paths={hex.paths}
              claimedColor={"#000"}
              claimedOpacity={0.3}
              reservedColor={"#000"}
              reservedOpacity={0.3}
              onClick={onHexagonClick}
            />
          )
        }
                
      </Map>

      { selectedPlace &&

        <div className={styles["zone-selection-container"]}>

          <div className={styles["header"]}>Zone Selection</div>

          <div className={styles["content-container"]}>
            Service Center Address
            <div className={styles["address"]}>
              <div className={styles["pin-svg"]}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24" fill="none">
                  <path d="M12.2674 23.2434C15.2554 20.6108 20.5714 15.2325 20.5714 10.2968C20.5714 7.56595 19.4878 4.94691 17.5588 3.01587C15.6299 1.08484 13.0137 0 10.2857 0C7.55777 0 4.94156 1.08484 3.01262 3.01587C1.08367 4.94691 4.06495e-08 7.56595 0 10.2968C0 15.2325 5.31429 20.6108 8.304 23.2434C8.84934 23.7307 9.55474 24 10.2857 24C11.0167 24 11.7221 23.7307 12.2674 23.2434ZM6.85714 10.2968C6.85714 9.38654 7.21837 8.51353 7.86135 7.86985C8.50433 7.22618 9.3764 6.86456 10.2857 6.86456C11.195 6.86456 12.0671 7.22618 12.7101 7.86985C13.3531 8.51353 13.7143 9.38654 13.7143 10.2968C13.7143 11.2071 13.3531 12.0802 12.7101 12.7238C12.0671 13.3675 11.195 13.7291 10.2857 13.7291C9.3764 13.7291 8.50433 13.3675 7.86135 12.7238C7.21837 12.0802 6.85714 11.2071 6.85714 10.2968Z" fill="#0C1433"/>
                </svg>
              </div>
              <div className={styles["address-text"]}>
                255 5th Street, Bergbron Randburg, 1712, South Africa
              </div>
            </div>
          </div>

          <div className={styles["content-container"]}>
            Select zones to be claimed for your Service Center, only adjacent zones can be selected.
            { [...selectedHexagons, ...Array(7 - selectedHexagons.length).fill(null)].map((hex, index) => !hex
            
              ? <div key={index} className={styles["zone"]}>
                  Select Zone On Map
                </div>
              : <div key={hex} className={styles["zone-selected"]}>
                  <div>
                    <div className={styles["zone-index"]}>{index + 1}</div>Zone: {hex}
                  </div>
                  <svg onClick={() => onRemoveZone(hex)} className={styles["zone-close"]} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.58369 3.24638C4.41032 3.08423 4.18101 2.99595 3.94407 3.00014C3.70713 3.00434 3.48107 3.10068 3.3135 3.26888C3.14593 3.43707 3.04995 3.66398 3.04577 3.90181C3.04159 4.13963 3.12954 4.3698 3.29109 4.54382L7.8274 9.0971L3.29109 13.6504C3.20123 13.7344 3.12916 13.8358 3.07917 13.9484C3.02919 14.061 3.00231 14.1825 3.00014 14.3058C2.99798 14.4291 3.02057 14.5515 3.06656 14.6658C3.11256 14.7801 3.18103 14.884 3.26787 14.9711C3.35472 15.0583 3.45817 15.127 3.57205 15.1732C3.68593 15.2194 3.80791 15.242 3.93071 15.2399C4.05351 15.2377 4.17462 15.2107 4.28681 15.1605C4.39899 15.1104 4.49996 15.038 4.58369 14.9478L9.12 10.3945L13.6563 14.9478C13.74 15.038 13.841 15.1104 13.9532 15.1605C14.0654 15.2107 14.1865 15.2377 14.3093 15.2399C14.4321 15.242 14.5541 15.2194 14.6679 15.1732C14.7818 15.127 14.8853 15.0583 14.9721 14.9711C15.059 14.884 15.1274 14.7801 15.1734 14.6658C15.2194 14.5515 15.242 14.4291 15.2399 14.3058C15.2377 14.1825 15.2108 14.061 15.1608 13.9484C15.1108 13.8358 15.0388 13.7344 14.9489 13.6504L10.4126 9.0971L14.9489 4.54382C15.1105 4.3698 15.1984 4.13963 15.1942 3.90181C15.19 3.66398 15.0941 3.43707 14.9265 3.26888C14.7589 3.10068 14.5329 3.00434 14.2959 3.00014C14.059 2.99595 13.8297 3.08423 13.6563 3.24638L9.12 7.79966L4.58369 3.24638Z" fill="white"/>
                  </svg>
                </div>
              )
            }
          </div>

          <div className={styles["actions"]}>

            <Button
              style={{ flex: 1, margin: '0 2px 0 0', padding: '5px 0' }}
              type={'secondaryoutline'}
              text={'Back'}
            />

            <Button
              disabled={selectedHexagons.length < 7}
              style={{ flex: 1, margin: '0 0 0 2px', padding: '5px 0' }}
              type={'secondary'}
              text={'Next'}
              onClick={() => setShowConfirmModal(true)}
            />

          </div>

        </div>
      }

      { showConfirmModal &&

        <div className={styles["modal-container"]}>

          <div className={styles["modal"]}>

            <div className={styles["header"]}>Confirm Zone Selection</div>

            <div className={styles["content-container"]}>
              Please confirm your zone selection.
              { [...selectedHexagons, ...Array(7 - selectedHexagons.length).fill(null)].map((hex, index) => !hex
              
                ? <div key={index} className={styles["zone"]}>
                    Select Zone On Map
                  </div>
                : <div key={hex} className={styles["zone-selected"]}>
                    <div>
                      <div className={styles["zone-index"]}>{index + 1}</div>Zone: {hex}
                    </div>
                  </div>
                )
              }
            </div>

            <div className={styles["actions"]}>

              <Button
                style={{ flex: 1, margin: '0 2px 0 0', padding: '5px 0' }}
                type={'secondaryoutline'}
                text={'Back'}
                onClick={() => setShowConfirmModal(false)}
              />

              <Button
                style={{ flex: 1, margin: '0 0 0 2px', padding: '5px 0' }}
                type={'secondary'}
                text={'Confirm'}
              />

            </div>

          </div>

        </div>
      }

      { !selectedPlace &&

        <LocationSearchBar
          onLocationChange={onSearchLocationChange}
        />
      }

    </>
  );
};