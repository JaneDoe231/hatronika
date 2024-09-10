import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  Constants
} from "common";

import {
  Button
} from "common/components";

import {
  withCommon
} from 'common/hocs';

import styles from './Portal.module.css';

const MENU_ITEMS = [
  {
    title: "Dashboard",
    path: "/portal/dashboard"
  },
  {
    title: "Sales",
    path: "/portal/sales"
  },
  {
    title: "Service Center",
    path: "/portal/service-center"
  },
  {
    title: "Owner",
    path: "/portal/owner"
  }
];

const PortalPage = props => {

  const [menuItems, setMenuItems] = useState([]);
  const urlParams = useParams();
  const { page } = urlParams;

  const load = () => {

    setMenuItems(MENU_ITEMS.map((item, index) => (
      <div
        key={`menu-${index}`}
        className={styles.menuItemContainerItem}
        style={{
          backgroundColor: props.location.pathname === item.path
            ? Constants.Colors.white
            : "transparent"
        }}
        onClick={() => props.location.pathname !== item.path && props.navigate(item.path)}>
          {item.title}
      </div>
    )));
  };

  useEffect(() => {
    load();
  }, [page]);

  return (
    <div className={styles.container}>

      <div className={styles.sideContainer}>

        <div className={styles.logoContainer} style={{ backgroundColor: Constants.Colors.secondary }}>
          <img
            className={styles.logo}
            src={Constants.Images.Icons.Logo}
          />
        </div>

        <div className={styles.menuItemContainer}>{menuItems}</div>

        <Button
          type={"secondaryoutline"}
          text={"Logout"}
          style={{
            margin: "20px 15px"
          }}
        />

      </div>

      <div className={styles.contentContainer}>{page}</div>

    </div>
  );
};

export const Portal = withCommon(PortalPage, {
  showHeader: false,
  isHeaderSeeThrough: true
});