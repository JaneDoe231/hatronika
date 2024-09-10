import {
  useEffect,
  useState,
} from "react";

import {
  Constants
} from "common";

import {
  Button
} from "common/components";

import
  styles
from './Header.module.css';

const ToggleButton = ({
  text,
  isToggled,
  onClick,
}) => {

  return (
    <div
      onClick={onClick}
      className={styles.toggleButton}
      style={{
        backgroundColor: isToggled
          ? Constants.Colors.primary
          : Constants.Colors.white,
        color: isToggled
          ? Constants.Colors.white
          : Constants.Colors.black
      }}>
        {text}
    </div>
  );
};

export const Header = ({
  navigate,
  isSeeThrough,
  showBackButton,
  showLoginButton,
  showCloseButton,
  showSystemsFilters,
  onBackClick,
  onFilterToggle,
}) => {

  const [toggleState, setToggleState] = useState({
    systems: true,
    serviceCentres: false
  });

  const onToggleSystems = () => {

    setToggleState(prev => ({
      ...prev,
      systems: !prev.systems
    }));
  };

  const onToggleServiceCentres = () => {

    setToggleState(prev => ({
      ...prev,
      serviceCentres: !prev.serviceCentres
    }));
  };

  const onClickLogin = () => {
    navigate('/login');
  }

  useEffect(() => {
    onFilterToggle && onFilterToggle(toggleState);
  }, [toggleState]);

  return (
    <div
      className={styles.header}
      style={{
        backgroundColor: isSeeThrough ? `${Constants.Colors.secondary}B3` : Constants.Colors.secondary
      }}
    >

      <div className={styles.content}>

        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>

          { showBackButton &&

            <div onClick={onBackClick} style={{ cursor: "pointer", width: "40px"  }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M9.65985 0.348553C9.55275 0.238067 9.42552 0.150408 9.28544 0.0905973C9.14536 0.0307868 8.99519 0 8.84352 0C8.69186 0 8.54169 0.0307868 8.40161 0.0905973C8.26153 0.150408 8.1343 0.238067 8.02719 0.348553L0.269752 8.33074C0.184242 8.41854 0.116401 8.52284 0.0701132 8.63766C0.0238255 8.75248 0 8.87557 0 8.99987C0 9.12418 0.0238255 9.24726 0.0701132 9.36208C0.116401 9.4769 0.184242 9.5812 0.269752 9.66901L8.02719 17.6512C8.47917 18.1163 9.20787 18.1163 9.65985 17.6512C10.1118 17.1861 10.1118 16.4363 9.65985 15.9712L2.88939 9.00462L9.66908 2.02851C10.1118 1.56344 10.1118 0.813627 9.65985 0.348553Z" fill="white"/>
              </svg>
            </div>
          }

          { showSystemsFilters &&

            <div className={styles.toggleButtonContainer}>
              <ToggleButton
                text={"Systems"}
                isToggled={toggleState.systems}
                onClick={onToggleSystems}
              />

              <ToggleButton
                text={"Service Centres"}
                isToggled={toggleState.serviceCentres}
                onClick={onToggleServiceCentres}
              />
            </div>
          }
        </div>

        <img
          className={styles.logo}
          src={Constants.Images.Icons.Logo}
        />

        <div className={styles.loginActionContainer}>

          { showCloseButton &&

            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.68744 0.531315C2.46529 0.324315 2.17146 0.211623 1.86787 0.216979C1.56427 0.222336 1.27461 0.345324 1.0599 0.560031C0.845193 0.774739 0.722206 1.0644 0.716849 1.368C0.711493 1.67159 0.824185 1.96542 1.03119 2.18757L6.84369 8.00007L1.03119 13.8126C0.916049 13.9199 0.823702 14.0492 0.759652 14.193C0.695602 14.3367 0.661162 14.4919 0.658386 14.6492C0.655609 14.8066 0.684554 14.9629 0.743493 15.1088C0.802432 15.2547 0.890158 15.3873 1.00144 15.4986C1.11272 15.6098 1.24527 15.6976 1.39119 15.7565C1.53711 15.8154 1.6934 15.8444 1.85075 15.8416C2.0081 15.8388 2.16328 15.8044 2.30703 15.7403C2.45077 15.6763 2.58015 15.584 2.68744 15.4688L8.49993 9.65632L14.3124 15.4688C14.4197 15.584 14.5491 15.6763 14.6928 15.7403C14.8366 15.8044 14.9918 15.8388 15.1491 15.8416C15.3065 15.8444 15.4628 15.8154 15.6087 15.7565C15.7546 15.6976 15.8872 15.6098 15.9984 15.4986C16.1097 15.3873 16.1974 15.2547 16.2564 15.1088C16.3153 14.9629 16.3443 14.8066 16.3415 14.6492C16.3387 14.4919 16.3043 14.3367 16.2402 14.193C16.1762 14.0492 16.0838 13.9199 15.9687 13.8126L10.1562 8.00007L15.9687 2.18757C16.1757 1.96542 16.2884 1.67159 16.283 1.368C16.2777 1.0644 16.1547 0.774739 15.94 0.560031C15.7253 0.345324 15.4356 0.222336 15.132 0.216979C14.8284 0.211623 14.5346 0.324315 14.3124 0.531315L8.49993 6.34382L2.68744 0.531315Z" fill="white"/>
            </svg>
          }

          { showLoginButton &&

            <>
              <div className={styles.labelAlreadyJoined}>Already Joined?</div>

              <Button
                text={"Login"}
                style={{
                  backgroundColor: Constants.Colors.secondary,
                  color: Constants.Colors.primary,
                  border:`2px solid ${Constants.Colors.primary}`,
                  borderRadius: "50px",
                  padding: "10px 20px",
                }}
                onClick={onClickLogin}
              />
            </>
          }

        </div>

      </div>

    </div>
  );
};