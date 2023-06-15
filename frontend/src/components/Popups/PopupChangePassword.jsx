import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormChangePassword } from '../Forms';

export function PopupChangePassword({ visible, setVisible, onChangePassword }) {
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
			<FormChangePassword onChangePassword={onChangePassword} />
		</Dialog>
	);
}

PopupChangePassword.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onChangePassword: PropTypes.func.isRequired,
};
