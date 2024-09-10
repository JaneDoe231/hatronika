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
from './ForgotPassword.module.css';

const ForgotPasswordComponent = (props) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onClickSubmit = async () => {

    try {

      setIsSubmitting(true);

      if (!Validations.isValidEmail(email)) {
        throw new Error("Invalid email address!");
      }

      const res = await AuthApi.SendOtp({
        email
      });

      if (!res.ok || !res.data) {
        throw new Error(res.message);
      }

      props.navigate('/enter-otp?type=forgotpassword', {
        email: email,
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
          Forgot Password
        </div>
        <div className={styles.identityForm_spacer}>
        </div>
        <div className={styles.identityForm_description}>
          Enter your email address below, then we can send you an OTP so you can reset your password.
        </div>
        <TextInput
          autoSpaceRemove={true}
          placeholder={'Email'}
          value={email}
          onChange={(e) => setEmail(e)}
        />
        <Button
          type={'primary'}
          text={'Submit'}
          style={{ margin: 0 }}
          loading={isSubmitting}
          onClick={onClickSubmit}
        />
      </div>
    </div>
  );
};

export const ForgotPassword = withCommon(ForgotPasswordComponent, {
  isHeaderSeeThrough: true,
  isHeaderTransparent: false,
  showHeaderBackButton: true
});
