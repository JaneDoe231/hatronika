import {
	useState,
} from 'react';

import {
	Button,
  TextInput
} from 'common/components';

import {
	withCommon
} from 'common/hocs';

import {
  Logger,
  Validations
} from 'common';

import {
  AuthApi
} from 'api';

import
  styles
from './Register.module.css';

const RegisterComponent = (props) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClickLogin = () => {
    props.navigate('/login');
  }

  const onClickSubmit = async () => {

    try {

      setIsSubmitting(true);

      if (!Validations.isValidEmail(email)) {
        throw new Error("Invalid email address!");
      }

      if (!firstName || firstName.trim() === '') {
        throw new Error("Invalid first name!");
      }

      if (!lastName || lastName.trim() === '') {
        throw new Error("Invalid last name!");
      }

      if (!Validations.isValidPhone(phoneNumber)) {
        throw new Error("Invalid phone number!");
      }

      const res = await AuthApi.SendOtp({
        email
      });

      if (!res.ok || !res.data) {
        throw new Error(res.message);
      }

      props.navigate('/enter-otp?type=register', {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        guid: res.data.guid
      });

    }
    catch (err) {

      Logger.error("ForgotPassword", "onClickSubmit", err);
      props.showToast(err.message, "error");
    }
    finally {

      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.identityForm}>
        <div className={styles.identityForm_title}>
          Register
        </div>
        <div className={styles.identityForm_spacer}>
        </div>
        <div className={styles.identityForm_description}>
          Enter your email and details below to create an account.
        </div>
        <TextInput
          placeholder={'Email'}
          value={email}
          onChange={(e) => setEmail(e)}
        />
        <TextInput
          placeholder={'First Name'}
          value={firstName}
          onChange={(e) => setFirstName(e)}
        />
        <TextInput
          placeholder={'Last Name'}
          value={lastName}
          onChange={(e) => setLastName(e)}
        />
        <TextInput
          placeholder={'Phone Number'}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e)}
        />
        <Button
          type={'primary'}
          text={'Continue'}
          style={{ margin: 0 }}
          loading={isSubmitting}
          onClick={onClickSubmit}
        />
        <div className={styles.identityForm_register}>
          Already have an account?&nbsp;
          <span
            className={styles.identityForm_registerbtn}
            onClick={onClickLogin}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export const Register = withCommon(RegisterComponent, {
  isHeaderSeeThrough: true,
  isHeaderTransparent: false,
  showHeaderBackButton: true
});
