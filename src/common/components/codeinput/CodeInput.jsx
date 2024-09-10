import
  React, {
    useState,
    useEffect
  }
from 'react';

import
  ReactCodeInput
from "react-code-input";

import
  styles
from './CodeInput.module.css';

const CELL_COUNT = 4;
export const CodeInput = ({
  value,
  setValue,
  secureTextEntry,
  onEndEditing,
}) => {
  const [codeValue, setCodeValue] = useState(value)

  useEffect(() => {
    if (value && value.length == CELL_COUNT && onEndEditing) {
      onEndEditing()
    }
  }, [value])

  useEffect(() => {
      setValue(codeValue)
  }, [codeValue])

  return (
    <>
      <ReactCodeInput
        type="text"
        inputMode="numeric"
        fields={CELL_COUNT}
        value={codeValue}
        onChange={val => setCodeValue(val)}
        className={styles.container}
        inputStyle={{
          MozAppearance: "textfield",
          width: "96px",
          height: "67px",
          border: "none",
          borderRadius: "12px",
          fontSize: "30px",
          color: 'black',
          backgroundColor: '#ECEDEF',
          textAlign: "center",
          textSecurity: 'disc',
          WebkitTextSecurity: secureTextEntry ? 'disc' : ''
        }}
        inputStyleInvalid={{
          MozAppearance: "textfield",
          width: "96px",
          height: "67px",
          borderRadius: "12px",
          fontSize: "30px",
          color: "red",
          border: "none",
          textAlign: "center",
        }}
      />
    </>
  );
};
