import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormChangePassword } from '../Forms';

export function PopupChangePassword({ visible, setVisible, onChangePassword }) {
	return (
		<Dialog visible={visible} onHide={() => setVisible(false)} blockScroll>
			<FormChangePassword onChangePassword={onChangePassword} />
		</Dialog>
	);
}

PopupChangePassword.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onChangePassword: PropTypes.func.isRequired,
};
