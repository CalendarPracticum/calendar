import React from 'react';
import PropTypes from 'prop-types';
import  styles from './Loader.module.css';

export function Loader({ isLoading }) {
  if (isLoading) {
    return (
      <div className={styles.preloader}>
        <div className={styles.preloader__container}>
          <span className={styles.preloader__round} />
        </div>
      </div>
    )
  }
}

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
