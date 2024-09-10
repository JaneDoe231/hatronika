import
  styles
from './Svg.module.css';

import {
  Constants
} from 'common';

export const Svg = props => {

  return (

    <div
      className={styles['svg-container']}
      style={{
        display: props.display || 'inline-block',
        padding: props.padding || '0',
        margin: props.margin || '0',
        cursor: props.onClick ? 'pointer' : undefined
      }}
      onClick={() => props.onClick && props.onClick()}>

      <div
        style={{
          maskImage: `url(${props.src})`,
          backgroundColor: props.color || Constants.Colors.white,
        }}
        className={styles['svg-container']}>

        <img
          className={styles['img-placeholder']}
          src={props.src}
          style={{
            height: props.height || 'auto',
            width: props.width || 'auto',
          }}
        />

      </div>

    </div>
  );
};