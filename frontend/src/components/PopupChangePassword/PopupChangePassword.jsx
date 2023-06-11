import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
// import { FormChangePassword } from '../FormChangePassword/FormChangePassword';

export function PopupChangePassword({
	visible,
	setVisible,
	// handleChangePassword,
	// message,
	// isError,
}) {
	const handleOverlayClick = (evt) => {
		if (evt.target === evt.currentTarget) {
			setVisible(false);
		}
	};

	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			onMaskClick={handleOverlayClick}
			blockScroll
		>
			FormChangePassword
			{/* <FormChangePassword
        showFormLogin={setShowFormLogin}
        handleLogin={handleLogin}
        message={message}
        isError={isError}
      /> */}
		</Dialog>
	);
}

PopupChangePassword.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	// handleChangePassword: PropTypes.func.isRequired,
	// message: PropTypes.string.isRequired,
	// isError: PropTypes.bool.isRequired,
};
