import {
	useEffect,
  useState,
} from 'react';

import {
  DataStore,
  Logger,
  Validations,
} from "common";

import {
  Button,
  TextInput
} from "common/components";

import {
	withCommon
} from 'common/hocs';

import
	styles
from './ContactDetails.module.css';

const ContactDetailsPage = (props) => {

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    additionalInfo: "",
    hasErrorFirstName: "",
    hasErrorLastName: "",
    hasErrorPhone: "",
    hasErrorEmail: "",
  });

  const onSubmitClick = () => {

    if (!validate()) {
      return;
    }

    // TODO: submit info to backend

    const queryParams = new URLSearchParams(props.location.search);
    const redirectUrl = queryParams.get("redirect") || "/";

    props.navigate(redirectUrl);
  };

  const validate = () => {

    const errorObj = {
      hasErrorFirstName: !state.firstName,
      hasErrorLastName: !state.lastName,
      hasErrorPhone: !Validations.isValidPhone(state.phone),
      hasErrorEmail: !Validations.isValidEmail(state.email),
    };

    const hasError = Object.values(errorObj).includes(true);

    if (hasError) {

      setState(prev => ({
        ...prev,
        ...errorObj
      }));
    }

    return !hasError;
  };

	return (

    <div className={styles.container}>

      <div className={styles.title}>Contact Details</div>

      <TextInput
        label={"First Name"}
        containerStyle={{
          margin: "0 0 18px 0"
        }}
        onChange={(val) => {
          setState(prev => ({
            ...prev,
            firstName: val,
            hasErrorFirstName: false
          }));
        }}
        value={state.firstName}
        hasError={state.hasErrorFirstName}
        errorMessage={"Please enter your first name"}
      />

      <TextInput
        label={"Last Name"}
        containerStyle={{
          margin: "0 0 18px 0"
        }}
        onChange={(val) => {
          setState(prev => ({
            ...prev,
            lastName: val,
            hasErrorLastName: false
          }));
        }}
        value={state.lastName}
        hasError={state.hasErrorLastName}
        errorMessage={"Please enter your last name"}
      />

      <TextInput
        label={"Phone Number"}
        containerStyle={{
          margin: "0 0 18px 0"
        }}
        onChange={(val) => {
          setState(prev => ({
            ...prev,
            phone: val,
            hasErrorPhone: false
          }));
        }}
        value={state.phone}
        hasError={state.hasErrorPhone}
        errorMessage={"Please enter a valid phone number"}
      />

      <TextInput
        label={"Email Address"}
        containerStyle={{
          margin: "0 0 18px 0"
        }}
        onChange={(val) => {
          setState(prev => ({
            ...prev,
            email: val,
            hasErrorEmail: false
          }));
        }}
        value={state.email}
        hasError={state.hasErrorEmail}
        errorMessage={"Please enter a valid email address"}
      />

      <TextInput
        label={"Additional Information"}
        containerStyle={{
          margin: "0 0 18px 0"
        }}
        onChange={(val) => {
          setState(prev => ({
            ...prev,
            additionalInfo: val,
          }));
        }}
        value={state.additionalInfo}
        multiline
      />

      <div className={styles.actionContainer}>

        <Button
          text={"Submit"}
          type={"primary"}
          style={{
            padding: "12px 50px",
            marginRight: 0,
            marginTop: "2px"
          }}
          onClick={onSubmitClick}
        />

      </div>
    </div>

	);
};

export const ContactDetails = withCommon(ContactDetailsPage, {
  showHeaderBackButton: true,
  showHeaderCloseButton: true,
  headerCloseButtonPath: "/"
});