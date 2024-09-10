import {
  useState,
} from 'react';

import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

import {
  Header,
  Loader,
} from 'common/components';

import {
  DataStore
} from 'common';

import
  styles
from './withCommon.module.css';

import {
  useToast
} from 'context';

export const withCommon = (WrappedComponent, options = {}) => {

  options = {
    showHeader: true,
    isHeaderTransparent: options.isHeaderSeeThrough,
    isHeaderSeeThrough: false,
    showHeaderBackButton: false,
    showHeaderCloseButton: false,
    showHeaderLoginButton: false,
    showHeaderSystemsFilters: false,
    headerBackPath: "",
    isBackNavigablePage: true,
    ...options
  };

  const WithCommon = (props) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [headerOptions, setHeaderOptions] = useState(options);
    const { showToast } = useToast();

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    const onHeaderBackClick = () => {

      if (options.headerBackPath) {

        navigate(options.headerBackPath);
        return;
      }

      navigate(-1);
    };

    const commonNavigate = (path, pageParams) => {
      
      if (options.isBackNavigablePage) {
        DataStore.set("LAST_NAVIGABLE_PAGE", location.pathname);
      }

      navigate(path, {
        state: pageParams || {},
        replace: !options.isBackNavigablePage
      });
    };

    const updateHeaderOptions = (hOptions) => {

      setHeaderOptions(prev => ({
        ...prev,
        ...hOptions
      }));
    };

    return (
      <>

        { !options.isHeaderSeeThrough && <div style={{ height: "150px" }}/> }

        <WrappedComponent
          navigate={commonNavigate}
          location={location}
          pageParams={location.state}
          showLoader={showLoader}
          hideLoader={hideLoader}
          showToast={showToast}
          updateHeaderOptions={updateHeaderOptions}
        />

        { headerOptions.showHeader &&

          <Header
            navigate={commonNavigate}
            isSeeThrough={headerOptions.isHeaderTransparent}
            showBackButton={headerOptions.showHeaderBackButton}
            showCloseButton={headerOptions.showHeaderCloseButton}
            showLoginButton={headerOptions.showHeaderLoginButton}
            showSystemsFilters={headerOptions.showHeaderSystemsFilters}
            onFilterToggle={headerOptions.onFilterToggle}
            onBackClick={onHeaderBackClick}
          />
        }

        { isLoading &&

          <div className={styles.loaderContainer}>

            <Loader />

          </div>
        }

      </>
    );
  }

  return WithCommon;
};