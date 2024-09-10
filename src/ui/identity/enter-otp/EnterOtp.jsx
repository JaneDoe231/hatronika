import {
  useEffect,
	useState,
} from 'react';

import {
	Button,
  CodeInput
} from 'common/components';

import {
	withCommon
} from 'common/hocs';

import {
  Constants
} from 'common';

import {
  Logger
} from 'common';

import {
  AuthApi
} from 'api';

import
  styles
from './EnterOtp.module.css';

const EnterOtpComponent = (props) => {

  const queryParams = new URLSearchParams(props.location?.search);
  const type = queryParams.get("type");

  const prevState = props.pageParams || {};

  const [otp, setOtp] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  
  const onClickSubmit = async () => {

    try {

      setIsSubmitting(true);

      const res = await AuthApi.verifyOtp({
        email: prevState.email,
        otp: otp,
        guid: prevState.guid
      });

      if (!res.ok || !res.data) {
        throw new Error(res.message);
      }

      props.navigate(`/confirm-password?type=${type}`, {
        ...prevState,
        guid: res.data.guid,
        otp: otp
      });

    }
    catch (err) {

      Logger.error("EnterOtp", "onClickSubmit", err);
      props.showToast(err.message, "error");
    }
    finally {

      setIsSubmitting(false);
    }
  }

  const onClickResend = async () => {
    
    try {

      const res = await AuthApi.resendOtp({
        email: prevState.email,
        guid: prevState.guid
      });

      if (!res.ok || !res.data) {
        throw new Error(res.message);
      }

      props.showToast('Otp resent successfully', 'success');
      setResendTimeout(60);
    }
    catch (err) {

      Logger.error("EnterOtp", "onClickResend", err);
      props.showToast(err.message, "error");
    }
  }

  useEffect(() => {
    setSubmitDisabled(otp.length < 4);
  }, [otp]);

  useEffect(() => {
    if (!resendTimeout) return;

    const intervalId = setInterval(() => {
      setResendTimeout(resendTimeout - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [resendTimeout]);


  return (
    <div className={styles.container}>
      <div className={styles.identityForm}>
        <div className={styles.identityForm_title}>
          Enter OTP
        </div>
        <div className={styles.identityForm_spacer}>
        </div>
        <div className={styles.identityForm_description}>
          Please enter the One Time Pin sent to:
          <br/>
          <span className={styles.identityForm_descriptionBold}>
            {prevState.email || ""}
          </span>
        </div>
        
        <CodeInput
          value={otp}
          setValue={setOtp}
          onEndEditing={() => {}}
        />

        <div className={styles.identityForm_resend}>
          <div>Not Received?</div>

          <div
            className={styles.identityForm_resendBtn}
            style={{
              borderColor: resendTimeout > 0 ? Constants.Colors.gray : Constants.Colors.secondary
            }}
            onClick={() => resendTimeout == 0 && onClickResend() }
          >
            {`${resendTimeout > 0 ? `${resendTimeout}s` : 'Resend Code'}`}
          </div>
        </div>

        <Button
          type={'primary'}
          text={'Submit'}
          style={{ margin: 0 }}
          disabled={submitDisabled}
          loading={isSubmitting}
          onClick={onClickSubmit}
        />
      </div>
    </div>
  );
};

export const EnterOtp = withCommon(EnterOtpComponent, {
  isHeaderSeeThrough: true,
  isHeaderTransparent: false,
  showHeaderBackButton: true
});
