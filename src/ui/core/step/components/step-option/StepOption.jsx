import
  styles
from "./StepOption.module.css";

export const StepOption = ({
  title,
  text,
  icon,
  nextStep,
  nextUrl,
  option,
  onClick,
}) => (

  <div
    className={styles.container}
    onClick={() => onClick && onClick(nextStep, nextUrl, option)}>

    <div className={styles.col}>

      <div className={styles.title}>{title}</div>

      <div className={styles.text}>{text}</div>

    </div>

    <div className={styles.col}>

      <div
        className={styles.icon}
        style={{
          backgroundImage: `url(${icon})`
        }}
      />

    </div>

  </div>
);