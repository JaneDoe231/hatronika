import {
  useEffect
} from "react";

import {
  Constants
} from "common";

import {
  Svg
} from "common/components";

import
  styles
from "./Toast.module.css";

export const Toast = ({
  show,
  message,
  type = "info",
  duration = 3000,
  onClose,
  offset
}) => {

  useEffect(() => {

    const timer = setTimeout(() => {

      if (typeof onClose === "function") {

        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      style={{
        bottom: 20 + offset,
        color: Constants.Colors.white
      }}
    >
      {message}
      <Svg
        margin={"0 0 0 20px"}
        onClick={onClose}
        src={Constants.Images.Icons.Close}
        width={"18px"}
        height={"18px"}
      />
    </div>
  );
};
