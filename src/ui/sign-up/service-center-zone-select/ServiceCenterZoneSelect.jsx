import {
	ServiceCenterMapSelect
} from 'common/components';

import {
	withCommon
} from 'common/hocs';

import styles from './ServiceCenterZoneSelect.module.css';

const ServiceCenterZoneSelectPage = (props) => {

  return (
    <div className={styles.container}>
      <ServiceCenterMapSelect
        {...props}
      />
    </div>
  );
};

export const ServiceCenterZoneSelect = withCommon(ServiceCenterZoneSelectPage);