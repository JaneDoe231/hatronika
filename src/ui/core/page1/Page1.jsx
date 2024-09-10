import {
  useEffect,
	useState
} from "react";

import {
	AdvancedMarker,
  InfoWindow,
	Map,
	useMap,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';

import {
	DataStore,
  Logger
} from "common";

import {
	Button
} from "common/components";

import {
	LocationSearchBar,
	MarkerWithInfowindow,
	Polygon
} from "ui/core/page1/components";

import {
  withCommon
} from 'common/hocs';

import {
  MapApi
} from "api";

import styles from './Page1.module.css';

const Page1Component = (props) => {

	const [selectedPlace, setSelectedPlace] = useState(null);
  const [systemPoints, setSystemPoints] = useState([]);
  const [hexagons, setHexagons] = useState([])

  const [toggleState, setToggleState] = useState({
    systems: true,
    serviceCentres: false
  });

	const [markerRef, marker] = useAdvancedMarkerRef();
	const map = useMap();

	const onSearchLocationChange = (place) => {

		if (place.geometry?.viewport) {

      map.fitBounds(place.geometry?.viewport, { top: 350 });

			place.coords = {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng()
			};

			setSelectedPlace(place);
    }
	};

	const onPinDragged = (event) => {

		if (!event.latLng) {
			return;
		}

		const place = selectedPlace;

		place.coords = {
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		};

		setSelectedPlace({
			...place
		});
	};

	const onContinueClick = () => {

		DataStore.set("LEAD_DATA", {
			place: selectedPlace
		});

		props.navigate("/step/payment-options");
	};

	const onSearchAgainClick = () => {
		setSelectedPlace(null);
	};

  const onHeaderFiltersChange = (filters) => {

    setToggleState({
      ...filters
    });
  };

  useEffect(() => {

    MapApi.getMapSystemData()
      .then(ret => {
        
        if (ret.ok) {

          setSystemPoints(ret.data.systemPoints || []);
          setHexagons(ret.data.serviceCentres || []);
          return;
        }

        throw Error("No system data found")
      })
      .catch(e => {

        Logger.error("Page1", "useEffect.load", e);
        props.showToast("Map data could not be loaded", "error");
      })

    props.updateHeaderOptions({
      onFilterToggle: onHeaderFiltersChange
    });
  }, []);

	return (
		<div className={styles.container}>
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

        { toggleState.serviceCentres && hexagons.map((hex, index) =>

            <Polygon
              key={index}
              data={hex}
              paths={hex.paths}
            />
          )
        }

				{ toggleState.systems && systemPoints.map((point, index) => {

          const stateToLower = point.state?.toLowerCase();

          const color = stateToLower === "live"
            ? "#1EE600"
            : stateToLower == "installation"
              ? "#6FA8F2"
              : stateToLower == "pending"
                ? "#FCFF5E"
                : "#979797";
        
          return (

            <MarkerWithInfowindow
              key={`marker-${index}`}
              lat={point.lat}
              lng={point.lng}
              infowindowHeaderDisabled={true}
              markerColor={color}
              infowindowContent={
                <div className={styles.pointInfoContainer} style={{ padding: "10px" }}>
                  <div className={styles.confirmAddressRow} style={{ margin: 0 }}>
                    <div className={styles.confirmAddressIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle opacity="0.1" cx="24" cy="24" r="24" fill="#00BE9C"/>
                        <path d="M19.8864 16.4545V31H15.9375V16.4545H19.8864ZM27.3544 31H21.7578V16.4545H27.2976C28.7938 16.4545 30.0864 16.7457 31.1754 17.3281C32.2692 17.9058 33.112 18.7391 33.7038 19.8281C34.3004 20.9124 34.5987 22.2121 34.5987 23.7273C34.5987 25.2424 34.3028 26.5445 33.7109 27.6335C33.1191 28.7178 32.281 29.5511 31.1967 30.1335C30.1125 30.7112 28.8317 31 27.3544 31ZM25.7067 27.6477H27.2124C27.9321 27.6477 28.5452 27.5317 29.0518 27.2997C29.5632 27.0677 29.9515 26.6676 30.2166 26.0994C30.4865 25.5312 30.6214 24.7405 30.6214 23.7273C30.6214 22.714 30.4841 21.9233 30.2095 21.3551C29.9396 20.7869 29.5419 20.3868 29.0163 20.1548C28.4955 19.9228 27.8563 19.8068 27.0987 19.8068H25.7067V27.6477Z" fill="#00BE9C"/>
                      </svg>
                    </div>
                    <div className={styles.confirmAddressInfo}>
                      {point.identifier}
                    </div>
                  </div>
                  <div className={styles.confirmAddressRow}>
                    <div className={styles.confirmAddressIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="24" fill="#ECEDEF"/>
                        <path d="M15.8683 32C14.8004 30.9494 13.9533 29.7022 13.3754 28.3296C12.7975 26.9569 12.5 25.4857 12.5 24C12.5 22.5143 12.7975 21.0431 13.3754 19.6704C13.9533 18.2978 14.8004 17.0506 15.8683 16M32.1317 16C33.1996 17.0506 34.0467 18.2978 34.6246 19.6704C35.2025 21.0431 35.5 22.5143 35.5 24C35.5 25.4857 35.2025 26.9569 34.6246 28.3296C34.0467 29.7022 33.1996 30.9494 32.1317 32M19.4818 28.445C18.8884 27.8613 18.4176 27.1684 18.0965 26.4057C17.7753 25.643 17.61 24.8255 17.61 24C17.61 23.1745 17.7753 22.357 18.0965 21.5943C18.4176 20.8316 18.8884 20.1387 19.4818 19.555M28.5182 19.555C29.1116 20.1387 29.5824 20.8316 29.9035 21.5943C30.2247 22.357 30.39 23.1745 30.39 24C30.39 24.8255 30.2247 25.643 29.9035 26.4057C29.5824 27.1684 29.1116 27.8613 28.5182 28.445M25.2778 24C25.2778 24.3334 25.1431 24.6531 24.9035 24.8889C24.6639 25.1246 24.3389 25.2571 24 25.2571C23.6611 25.2571 23.3361 25.1246 23.0965 24.8889C22.8569 24.6531 22.7222 24.3334 22.7222 24C22.7222 23.6666 22.8569 23.3469 23.0965 23.1111C23.3361 22.8754 23.6611 22.7429 24 22.7429C24.3389 22.7429 24.6639 22.8754 24.9035 23.1111C25.1431 23.3469 25.2778 23.6666 25.2778 24Z" stroke="#00BE9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div className={styles.confirmAddressInfo}>
                      {point.state}
                    </div>
                  </div>
                  <div className={styles.confirmAddressRow}>
                    <div className={styles.confirmAddressIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="24" fill="#ECEDEF"/>
                        <path d="M24.0001 33.3333C29.1547 33.3333 33.3334 29.1546 33.3334 24C33.3334 18.8453 29.1547 14.6666 24.0001 14.6666C18.8454 14.6666 14.6667 18.8453 14.6667 24C14.6667 29.1546 18.8454 33.3333 24.0001 33.3333Z" stroke="#00BE9C" strokeWidth="2"/>
                        <path d="M23.9999 26.6667C25.4727 26.6667 26.6666 25.4728 26.6666 24C26.6666 22.5273 25.4727 21.3334 23.9999 21.3334C22.5272 21.3334 21.3333 22.5273 21.3333 24C21.3333 25.4728 22.5272 26.6667 23.9999 26.6667Z" fill="#00BE9C" stroke="#00BE9C" strokeWidth="2"/>
                        <path d="M24 14.6667V12M33.3333 24H36M24 36V33.3333M12 24H14.6667" stroke="#00BE9C" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className={styles.confirmAddressInfo}>
                      <div>{`Lat: ${point.lat}`}</div>
                      <div>{`Lng: ${point.lng}`}</div>
                    </div>
                  </div>

                  <div className={styles.divider} />

                  <div>
                    <div className={styles.confirmAddressInfo} style={{ backgroundColor: color }}>{point.status}</div>
                  </div>
                </div>
              }
            />
					)})
				}

				{ !!selectedPlace &&
					
					<>
						<AdvancedMarker
							ref={markerRef}
							draggable={true}
							onDragEnd={onPinDragged}
							position={{lat: selectedPlace.coords.lat, lng: selectedPlace.coords.lng}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="#1EE600" height="24px" width="24px" viewBox="0 0 184.751 184.751" space="preserve" stroke="#1eff00">
								<g strokeWidth="0"/>
								<g strokeLinecap="round" strokeLinejoin="round"/>
								<g><path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z"/></g>
							</svg>
						</AdvancedMarker>

						<InfoWindow
							headerDisabled={true}
							anchor={marker}
							onCloseClick={() => console.log("close clicked")}>
							<div className={styles.confirmAddressContainer}>

								<div className={styles.confirmAddressTitle}>Confirm your address</div>

								<div className={styles.confirmAddressText}>Please confirm the hexagon below is on the correct location. You can drag the Hexagon around.</div>

								<div className={styles.confirmAddressRow}>
									<div className={styles.confirmAddressIcon}>
										<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
											<circle opacity="2" cx="24" cy="24" r="24" fill="#00BE9C"/>
											<path d="M25.9815 35.2434C28.9695 32.6108 34.2855 27.2325 34.2855 22.2968C34.2855 19.5659 33.2019 16.9469 31.2729 15.0159C29.344 13.0848 26.7278 12 23.9998 12C21.2719 12 18.6557 13.0848 16.7267 15.0159C14.7978 16.9469 13.7141 19.5659 13.7141 22.2968C13.7141 27.2325 19.0284 32.6108 22.0181 35.2434C22.5634 35.7307 23.2689 36 23.9998 36C24.7308 36 25.4362 35.7307 25.9815 35.2434ZM20.5713 22.2968C20.5713 21.3865 20.9325 20.5135 21.5755 19.8699C22.2184 19.2262 23.0905 18.8646 23.9998 18.8646C24.9091 18.8646 25.7812 19.2262 26.4242 19.8699C27.0672 20.5135 27.4284 21.3865 27.4284 22.2968C27.4284 23.2071 27.0672 24.0802 26.4242 24.7238C25.7812 25.3675 24.9091 25.7291 23.9998 25.7291C23.0905 25.7291 22.2184 25.3675 21.5755 24.7238C20.9325 24.0802 20.5713 23.2071 20.5713 22.2968Z" fill="#00BE9C"/>
										</svg>
									</div>
									<div className={styles.confirmAddressInfo}>
										{selectedPlace.formatted_address || selectedPlace.description}
									</div>
								</div>
								<div className={styles.confirmAddressRow}>
									<div className={styles.confirmAddressIcon}>
										<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
											<rect width="48" height="48" rx="24" fill="#ECEDEF"/>
											<path d="M24.0001 33.3333C29.1547 33.3333 33.3334 29.1546 33.3334 24C33.3334 18.8453 29.1547 14.6666 24.0001 14.6666C18.8454 14.6666 14.6667 18.8453 14.6667 24C14.6667 29.1546 18.8454 33.3333 24.0001 33.3333Z" stroke="#00BE9C" strokeWidth="2"/>
											<path d="M23.9999 26.6667C25.4727 26.6667 26.6666 25.4728 26.6666 24C26.6666 22.5273 25.4727 21.3334 23.9999 21.3334C22.5272 21.3334 21.3333 22.5273 21.3333 24C21.3333 25.4728 22.5272 26.6667 23.9999 26.6667Z" fill="#00BE9C" stroke="#00BE9C" strokeWidth="2"/>
											<path d="M24 14.6667V12M33.3333 24H36M24 36V33.3333M12 24H14.6667" stroke="#00BE9C" strokeWidth="2" strokeLinecap="round"/>
										</svg>
									</div>
									<div className={styles.confirmAddressInfo}>
										{`Lat: ${selectedPlace.coords.lat}, Lng: ${selectedPlace.coords.lng}`}
									</div>
								</div>

								<div className={styles.confirmAddressActionContainer}>

									<Button
										style={{ width: "100%", margin: "0 5px 0 0" }}
										text={"Change Address"}
										type={"secondaryoutline"}
										onClick={onSearchAgainClick}
									/>

									<Button
										style={{ width: "100%", margin: "0 0 0 5px"  }}
										text={"Continue"}
										type={"secondary"}
										onClick={onContinueClick}
									/>

								</div>
							</div>
						</InfoWindow>

					</>
				}

			</Map>

			{ !selectedPlace &&

				<LocationSearchBar
					onLocationChange={onSearchLocationChange}
				/>
			}

		</div>
	);
};

export const Page1 = withCommon(Page1Component, {
	isHeaderSeeThrough: true,
	showHeaderLoginButton: true,
  showHeaderSystemsFilters: true
});