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
from './Login.module.css';

const LoginComponent = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClickForgotPassword = () => {
    props.navigate('/forgot-password');
  }

  const onClickRegister = () => {
    props.navigate('/register');
  }

  const onClickSubmit = async () => {

    try {

      setIsSubmitting(true);

      if (!Validations.isValidEmail(email)) {
        throw new Error("Invalid email address!");
      }

      const res = await AuthApi.login({
        email,
        password
      });

      if (!res.ok) {
        throw new Error("Incorrect credential!");
      }

      props.navigate('/home');

    }
    catch (err) {

      Logger.error("Login", "onClickSubmit", err);
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
          Login
        </div>
        <div className={styles.identityForm_spacer}>
        </div>
        <TextInput
          autoSpaceRemove={true}
          placeholder={'Email'}
          value={email}
          onChange={(e) => setEmail(e)}
        />
        <TextInput
          placeholder={'Password'}
          type={'password'}
          value={password}
          onChange={(e) => setPassword(e)}
        />
        <div
          className={styles.identityForm_forgotpassword}
          onClick={onClickForgotPassword}
        >
          Forgot Password?
        </div>
        <Button
          type={'primary'}
          text={'Login'}
          style={{ margin: 0 }}
          onClick={onClickSubmit}
          loading={isSubmitting}
        />
        <div className={styles.identityForm_register}>
          Don't have an account?&nbsp;
          <span
            className={styles.identityForm_registerbtn}
            onClick={onClickRegister}
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export const Login = withCommon(LoginComponent, {
  isHeaderSeeThrough: true,
  isHeaderTransparent: false,
  showHeaderBackButton: true,
  headerBackPath: '/'
});
