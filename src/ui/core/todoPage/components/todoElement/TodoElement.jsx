import
  styles
from './TodoElement.module.css';

import {
  Constants
} from 'common';

export const TodoElement = props => (

  <div className={styles.item}>

    <img className={styles.image} src={Constants.Images.Icons.GreenTick} />

    <div style={{ flex: 1 }}>{props.text}</div>

    <img className={`${styles.image} ${styles.pointer}`} src={Constants.Images.Icons.Trash} />

  </div>
);