import {
	useEffect,
  useState,
} from 'react';

import {
  useParams
} from "react-router-dom";

import {
  DataStore,
  Logger,
} from "common";

import {
  Button,
  FileUpload,
  SliderInputCard
} from "common/components";

import {
	withCommon
} from 'common/hocs';

import {
  StepOption
} from "./components/";

import
	styles
from './Step.module.css';

const StepPage = (props) => {

  const [state, setState] = useState({});

  const urlParams = useParams();

  const onFormFieldValueChange = (value, fieldIndex) => {

    const formFields = state.formFields;

    formFields[fieldIndex].value = value;

    setState(prev => ({
      ...prev,
      formFields: formFields
    }));
  };

  const onNextClick = (nextStep, nextUrl, data) => {

    if (!nextStep && !nextUrl) {
      return;
    }

    const leadData = DataStore.get("LEAD_DATA");

    leadData.steps = leadData.steps || [];

    leadData.steps.push(data.formFields
      ? {
          ...data,
          identifier: state.identifier
        }
      : {
          selectedOption: data,
          identifier: state.identifier
        }
    );

    DataStore.set("LEAD_DATA", leadData);

    if (nextStep) {
      return props.navigate(`/step/${nextStep}`);
    }

    props.navigate(nextUrl);
  };

  const preloadIcons = (jsonData) => {

    const iconUrls = new Set();
  
    function extractIcons(data) {
      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
          data.forEach(extractIcons);
        } else {
          for (const key in data) {
            if (key === 'icon') {
              iconUrls.add(data[key]);
            } else {
              extractIcons(data[key]);
            }
          }
        }
      }
    }
  
    extractIcons(jsonData);
  
    iconUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

	const load = async () => {

    let config = DataStore.get("SIGN_UP_CONFIG");

    if (!config) {

      props.showLoader();

      const response = await fetch(`https://storage.googleapis.com/hatronika-assets/join-flow/config.json?t=${new Date().getTime()}`);

      props.hideLoader();

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      config = await response.json();

      preloadIcons(config);

      DataStore.set("SIGN_UP_CONFIG", config);
    }

    const { identifier } = urlParams;

    setState({
      identifier,
      ...config[identifier]
    });
	};

	useEffect(() => {

    load()
      .catch(e => Logger.error("Step", "useEffect.load", e));
  }, [urlParams]);

	return (

    <div className={styles.container}>

      <div className={styles.title}>{state.title}</div>

      { state?.options?.map((option, index) => (

        <StepOption
          key={`option-${state.identifier}-${index}`}
          title={option.title}
          text={option.text}
          icon={option.icon}
          nextStep={option.nextStep}
          nextUrl={option.nextUrl}
          option={option}
          onClick={onNextClick}
        />
      ))}

      { state?.formFields?.map((field, index) => {

        if (field.type === "upload") {
          return (
            <FileUpload
              key={`form-${state.identifier}-${index}`}
              title={field.label}
              onFileUploadComplete={(val) => onFormFieldValueChange(val, index)}
            />
          );
        }

        if (field.type === "slider-input-card") {
          return (
            <SliderInputCard
              key={`form-${state.identifier}-${index}`}
              label={field.label}
              text={field.text}
              max={field.max}
              min={field.min}
              step={field.step}
              onChange={(val) => onFormFieldValueChange(val, index)}
            />
          );
        }
      })}

      { state.actionText &&

        <div className={styles.actionContainer}>

          <Button
            text={state.actionText}
            type={"primary"}
            style={{
              width: "200px",
              margin: 0
            }}
            onClick={() => onNextClick(state.nextStep, state.nextUrl, state)}
          />

        </div>
      }

    </div>

	);
};

export const Step = withCommon(StepPage, {
  showHeaderBackButton: true,
  showHeaderCloseButton: true,
  headerCloseButtonPath: "/"
});