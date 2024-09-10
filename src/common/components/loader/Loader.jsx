import
	styles
from './Loader.module.css';

export const Loader = props => (

  <div className={styles['dot_spinner']} style={{ ...props.style }}>
    <div className={styles['dot_spinner__dot']}></div>
    <div className={styles['dot_spinner__dot']}></div>
    <div className={styles['dot_spinner__dot']}></div>
    <div className={styles['dot_spinner__dot']}></div>
    <div className={styles['dot_spinner__dot']}></div>
    <div className={styles['dot_spinner__dot']}></div>
    <div className={styles['dot_spinner__dot']}></div>
    <div className={styles['dot_spinner__dot']}></div>
  </div>
);