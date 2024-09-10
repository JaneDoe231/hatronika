import {
  useEffect,
  useState
} from "react";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import
  styles
from "./SliderInputCard.module.css";

export const SliderInputCard = ({
  min = 0,
  max = 100,
  step = 1,
  label,
  text,
  onChange = () => {}
}) => {

  const [value, setValue] = useState(min);

  const onSliderChange = (val) => {
    setValue(val);
  };

  const onInputChange = (e) => {

    let val = e.target.value;

    if (!val) {
      return setValue(min);
    }

    if (isNaN(val)) {
      return;
    }

    val = parseFloat(val);

    if (val > max) {
      return setValue(max);
    }

    if (val < min) {
      return setValue(min);
    }

    setValue(val);
  };

  const onPlusClick = () => {

    const newValue = value + step;

    if (newValue > max) {

      return setValue(max);
    }

    setValue(newValue);
  };

  const onMinusClick = () => {

    const newValue = value - step;

    if (newValue < min) {

      return setValue(min);
    }

    setValue(newValue);
  };

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (

    <div className={styles.container}>

      <div className={styles["top-container"]}>

        <div>
          <div className={styles["title"]}>{label}</div>
          <div className={styles["text"]}>{text}</div>
        </div>

        <div className={styles["counter-container"]}>

          <svg onClick={onMinusClick} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="15" fill="#0C1433"/>
            <rect x="6" y="13" width="18" height="4" rx="2" fill="white"/>
          </svg>

          <input
            className={styles["counter-text"]}
            type={"text"}
            value={value}
            onChange={onInputChange}
          />

          <svg onClick={onPlusClick} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="15" fill="#0C1433"/>
            <path d="M16.3846 7.38462C16.3846 6.61875 15.7659 6 15 6C14.2341 6 13.6154 6.61875 13.6154 7.38462V13.6154H7.38462C6.61875 13.6154 6 14.2341 6 15C6 15.7659 6.61875 16.3846 7.38462 16.3846H13.6154V22.6154C13.6154 23.3813 14.2341 24 15 24C15.7659 24 16.3846 23.3813 16.3846 22.6154V16.3846H22.6154C23.3813 16.3846 24 15.7659 24 15C24 14.2341 23.3813 13.6154 22.6154 13.6154H16.3846V7.38462Z" fill="white"/>
          </svg>

        </div>

      </div>

      <div className={styles["slider-container"]}>

        <div className={styles["slider-container-min-max-value"]}>
          <span>{min}</span>
          <span>{max}</span>
        </div>

        <div className={styles.slider}>
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onSliderChange}
          />
        </div>
      </div>
    </div>
  );
};