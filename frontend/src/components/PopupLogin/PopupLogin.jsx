import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormLogin } from '../FormLogin/FormLogin';

export function PopupLogin({ visible, setVisible }) {
	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			onMaskClick={() => setVisible(false)}
			modal
		>
			<FormLogin />
		</Dialog>
	);
}

PopupLogin.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
};
