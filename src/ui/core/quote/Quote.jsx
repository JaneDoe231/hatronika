import {
  Button
} from "common/components";

import {
  withCommon
} from 'common/hocs';

import styles from './Quote.module.css';

const QuotePage = props => {

  return (
    <div className={styles.container}>

      <div className={styles.title}>Your Power Panel Package includes</div>

    </div>
  );
};

export const Quote = withCommon(QuotePage, {
  showHeaderCloseButton: true,
  headerCloseButtonPath: "/"
});