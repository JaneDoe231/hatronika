import {
  Button
} from "common/components";

import {
  withCommon
} from 'common/hocs';

import styles from './ThankYou.module.css';

const ThankYouPage = props => {

  return (
    <div className={styles.container}>

      <div className={styles.title}>Thank You for Joining Hatronika!</div>

      <p className={styles.paragraph}>We appreciate your interest in joining Hatronika and for providing all the necessary details.</p>
      <p className={styles.paragraph}>One of our sales representatives will be in touch with you soon to discuss how we can help you achieve energy freedom with our innovative solutions.</p>
      <p className={styles.paragraph}>Thank you for taking the first step towards a sustainable future.</p>

      <div className={styles.actionContainer}>

        <Button
          text={"Continue"}
          type={"primary"}
          style={{
            padding: "12px 0",
            marginRight: 0,
            marginTop: "2px",
            width: "180px"
          }}
          onClick={() => props.navigate("/")}
        />

      </div>

    </div>
  );
};

export const ThankYou = withCommon(ThankYouPage, {
  showHeaderCloseButton: true,
  headerCloseButtonPath: "/"
});