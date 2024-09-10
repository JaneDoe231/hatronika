import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useMap,
  useMapsLibrary
} from "@vis.gl/react-google-maps";

import {
  Utils
} from "common";

import
  styles
from "./LocationSearchBar.module.css";

export const LocationSearchBar = ({
  onLocationChange
}) => {

  const map = useMap();
  const places = useMapsLibrary('places');

  const [autocompleteService, setAutocompleteService] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  const [predictionResults, setPredictionResults] = useState([]);

  const getAddress = (lat, lng) => {

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          typeof onLocationChange === "function" && onLocationChange(results[0]);
        } else {
          console.log("Nothing found");
        }
      } else {
        console.log("Failed", status);
      }
    });
  };

  const fetchPredictions = useCallback(
    Utils.debounce((inputValue) => {

      if (!autocompleteService || !inputValue) {
        setPredictionResults([]);
        return;
      }

      const request = {input: inputValue, sessionToken};

      autocompleteService.getPlacePredictions(request)
        .then(response => {

          setPredictionResults(response.predictions);
        })
        .catch(e => Logger.error("LocationSearch", "fetchPredictions", e));

    }, 500),
    [autocompleteService]
  );

  const onInputChange = (e) => {
    fetchPredictions(e.target?.value);
  };

  const onPredictionClick = (place) => {

    if (!places) {
      return;
    }

    const detailRequestOptions = {
      placeId: place.place_id,
      fields: ['geometry', 'name', 'formatted_address'],
      sessionToken
    };

    setPredictionResults([]);

    placesService?.getDetails(detailRequestOptions, (placeDetails) => {
      typeof onLocationChange === "function" && onLocationChange({
        ...place,
        ...placeDetails
      });
    });
  };

  const onUseCurrentLocationClick = () => {

		if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        getAddress(lat, lng);
      }, (e) => console.log(e));
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
	};

  useEffect(() => {

    if (!places || !map) {
      return;
    }

    setAutocompleteService(new places.AutocompleteService());
    setSessionToken(new places.AutocompleteSessionToken());
    setPlacesService(new places.PlacesService(map));

    return () => setAutocompleteService(null);
  }, [places, map]);

  return (
    <div
      className={styles.locationSearchBarContainer}>

      <div className={styles.container}>

        <svg style={{ height: "50px", width: "50px" }} xmlns="http://www.w3.org/2000/svg" width="45" height="46" viewBox="0 0 35 36" fill="none">
          <path d="M28.314 27.1913L23.1 21.9774C24.3553 20.3062 25.0329 18.2721 25.0307 16.1821C25.0307 10.8434 20.6872 6.5 15.3486 6.5C10.0099 6.5 5.6665 10.8434 5.6665 16.1821C5.6665 21.5207 10.0099 25.8642 15.3486 25.8642C17.4387 25.8664 19.4727 25.1888 21.1439 23.9335L26.3578 29.1475C26.6218 29.3834 26.966 29.5094 27.3199 29.4995C27.6738 29.4896 28.0104 29.3446 28.2607 29.0942C28.5111 28.8439 28.6561 28.5073 28.666 28.1534C28.6759 27.7995 28.5499 27.4553 28.314 27.1913ZM8.43281 16.1821C8.43281 14.8143 8.83842 13.4772 9.59833 12.3399C10.3582 11.2026 11.4383 10.3162 12.702 9.79274C13.9657 9.2693 15.3563 9.13235 16.6978 9.39919C18.0393 9.66604 19.2716 10.3247 20.2388 11.2919C21.206 12.2591 21.8646 13.4914 22.1315 14.8329C22.3983 16.1744 22.2614 17.5649 21.7379 18.8286C21.2145 20.0923 20.3281 21.1724 19.1908 21.9323C18.0535 22.6922 16.7164 23.0979 15.3486 23.0979C13.5151 23.0956 11.7573 22.3663 10.4608 21.0698C9.16434 19.7734 8.43501 18.0156 8.43281 16.1821Z" fill="#0C1433"/>
        </svg>

        <input
          className={styles.inputBox}
          type={"text"}
          placeholder={"Enter your address to join the Hatronika Network"}
          onChange={onInputChange}
        />

        <div className={styles.currentLocationContainer} onClick={onUseCurrentLocationClick}>

          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="24" fill="#0C1433"/>
            <path d="M23.9998 33.3333C29.1545 33.3333 33.3332 29.1546 33.3332 24C33.3332 18.8453 29.1545 14.6666 23.9998 14.6666C18.8452 14.6666 14.6665 18.8453 14.6665 24C14.6665 29.1546 18.8452 33.3333 23.9998 33.3333Z" stroke="white" strokeWidth="2"/>
            <path d="M24.0002 26.6667C25.4729 26.6667 26.6668 25.4728 26.6668 24C26.6668 22.5273 25.4729 21.3334 24.0002 21.3334C22.5274 21.3334 21.3335 22.5273 21.3335 24C21.3335 25.4728 22.5274 26.6667 24.0002 26.6667Z" fill="white" stroke="white" strokeWidth="2"/>
            <path d="M24 14.6667V12M33.3333 24H36M24 36V33.3333M12 24H14.6667" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>

          <div className={styles.currentLocationText}>Use Current Location</div>

        </div>

        { predictionResults.length > 0 &&

          <div className={styles.predictionsContainer}>

            { 
              predictionResults.map(prediction => (
                <div
                  key={prediction.place_id}
                  className={styles.predictionsItem}
                  onClick={() => onPredictionClick(prediction)}>
                    {prediction.description}
                </div>
              ))
            }
          </div>
        }

      </div>
    </div>
  );
};