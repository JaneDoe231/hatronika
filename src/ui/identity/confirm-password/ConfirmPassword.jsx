import {
	useState,
} from 'react';

import {
	Button,
  TextInput
} from 'common/components';

import {
  Constants,
  Validations,
  Logger
} from 'common';

import {
  AuthApi
} from 'api';

import {
	withCommon
} from 'common/hocs';

import
  styles
from './ConfirmPassword.module.css';

const ConfirmPasswordComponent = (props) => {

  const queryParams = new URLSearchParams(props.location?.search);
  const type = queryParams.get("type");
  const prevState = props.pageParams || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onClickSubmit = async () => {

    try {

      setIsSubmitting(true);

      if (password != confirmPassword) {
        throw new Error('Password does not match', 'error');
      }

      if (type === 'forgotpassword') {

        const res = await AuthApi.changePassword({
          email: prevState.email,
          password: password,
          otp: prevState.otp,
          guid: prevState.guid
        });

        if (!res.ok || !res.data) {
          throw new Error(res.message);
        }

        props.showToast('Password changed successfully', 'success');
      }
      else if (type === 'register') {

        const res = await AuthApi.register({
          email: prevState.email,
          firstName: prevState.firstName,
          lastName: prevState.lastName,
          phoneNumber: prevState.phoneNumber,
          password: password,
          otp: prevState.otp,
          guid: prevState.guid
        });

        if (!res.ok || !res.data) {
          throw new Error(res.message);
        }

        props.showToast('Registered successfully', 'success');
      }

      props.navigate('/login');
    }
    catch (err) {

      Logger.error("ConfirmPassword", "onClickSubmit", err);
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
          {`${type === 'register' ? 'Create' : 'Change'} Password`}
        </div>
        <div className={styles.identityForm_spacer}>
        </div>
        <div className={styles.identityForm_description}>
          Enter a new password below, then retype to confirm.
        </div> 
        <TextInput
          type="password"
          placeholder={'Password'}
          value={password}
          onChange={(e) => setPassword(e)}
        />
        <TextInput
          type="password"
          placeholder={'Confirm Password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e)}
        />
        <div
          className={styles.identityForm_condition}
          style={{
            backgroundColor: Constants.Colors.bgGray
          }}
        >
          <div className={styles.identityFrom_condition_row}>
            <div className={styles.identityFrom_condition_img}>
              <img
                style={{ width: "24px", height: "24px" }}
                src={
                  Validations.isValidPasswordLength(password)
                    ? Constants.Images.Icons.Tick
                    : Constants.Images.Icons.Failure
                }
              />
            </div>
            <div className={styles.identityForm_condition_desc}>
              At least 8 characters
            </div>
          </div>
          <div className={styles.identityFrom_condition_row}>
            <div className={styles.identityFrom_condition_img}>
              <img
                style={{ width: "24px", height: "24px" }}
                src={
                  Validations.isValidPasswordUpperLower(password)
                    ? Constants.Images.Icons.Tick
                    : Constants.Images.Icons.Failure
                }
              />
            </div>
            <div className={styles.identityForm_condition_desc}>
              Contains both upper case and lower case letters.
            </div>
          </div>
          <div className={styles.identityFrom_condition_row}>
            <div className={styles.identityFrom_condition_img}>
              <img
                style={{ width: "24px", height: "24px" }}
                src={
                  Validations.isValidPasswordSymbolNumber(password)
                    ? Constants.Images.Icons.Tick
                    : Constants.Images.Icons.Failure
                }
              />
            </div>
            <div className={styles.identityForm_condition_desc}>
              Contains a symbol and a number.
            </div>
          </div>
        </div>
        <Button
          type={'primary'}
          text={`${type === 'register' ? 'Register' : 'Change Password'}`}
          style={{ margin: 0 }}
          loading={isSubmitting}
          disabled={
            !(Validations.isValidPasswordLength(password)
            && Validations.isValidPasswordUpperLower(password)
            && Validations.isValidPasswordSymbolNumber(password))
          }
          onClick={onClickSubmit}
        />
      </div>
    </div>
  );
};

export const ConfirmPassword = withCommon(ConfirmPasswordComponent, {
  isHeaderSeeThrough: true,
  isHeaderTransparent: false,
  showHeaderBackButton: true,
  isBackNavigablePage: false
});
