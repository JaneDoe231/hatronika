import {
  useEffect,
  useState
} from "react";

import {
  Constants
} from "common";

import
  styles
from "./TextInput.module.css";

export const TextInput = (props) => {
  const [visible, setVisible] = useState(false);

  const [value, setValue] = useState(props.value || "");

  const onInputChange = (event) => {
    let newValue = event.target.value;
    if (props.autoSpaceRemove) {
      newValue = newValue.replace(" ", "");
    }
    typeof props.onChange === "function" && props.onChange(newValue);

    setValue(newValue);
  };

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  return (
    <div style={{ ...props.containerStyle }}>
      <div
        className={styles["text-input-container"]}
        onClick={() => props.onClick && props.onClick()}
        style={{
          border: props.hasError ? `1px solid ${Constants.Colors.failedRed}` : undefined
        }}
      >
        <div className={styles.inputContainer} style={{ height: props.multiline ? "150px" : undefined }}>
          {props.disabled ? (
            <div
              className={styles["input-field"]}
              style={{
                padding: "0 16px",
                textAlign: "left",
                cursor: "pointer",
                ...props.inputStyle,
              }}
            >
              {value || props.placeholder}
            </div>
          ) : (
            props.multiline
            
            ? <textarea
                className={styles["input-field"]}
                style={{ height: "150px", lineHeight: "22px", paddingTop: "22px", resize: "none" }}
                value={value}
                onChange={onInputChange}
              />
            
            : <input
                disabled={props.disabled}
                className={styles["input-field"]}
                type={
                  props.type == "password"
                    ? visible
                      ? "text"
                      : "password"
                    : props.type || "text"
                }
                placeholder={props.placeholder}
                value={value}
                onChange={onInputChange}
                style={{
                  ...props.inputStyle,
                  paddingTop: value && props.label &&  '15px',
                  paddingBottom: value && props.label && '0'
                }}
              />
          )}

          {props.rightIcon && (
            <div
              className={styles.rightIconContainer}
              onClick={() => props.rightIcon1 && setVisible(!visible)}
            >
              {visible && props.rightIcon1 ? props.rightIcon1 : props.rightIcon}
            </div>
          )}

          {props.label && !props.disabled && (
            <label className={value && styles.filled}>{props.label}</label>
          )}
        </div>
      </div>
      { props.hasError && props.errorMessage && (
        <div className={styles["error-message-container"]}>
          <label
            className={styles["error-message-label"]}
            style={{ color: Constants.Colors.failedRed }}
          >
            {props.errorMessage}
          </label>
        </div>
      )}
    </div>
  );
};
