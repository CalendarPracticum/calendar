import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormLogin } from '../Forms/FormLogin';
import { FormRegistration } from '../Forms';

export function PopupLogin({
	visible,
	setVisible,
	handleRegister,
	handleLogin,
	isFormLogin,
	setIsFormLogin,
}) {
	return (
		<Dialog
			visible={visible}
			onHide={() => {
				setVisible(false);
				setIsFormLogin(true);
			}}
			blockScroll
			headerStyle={{ padding: `16px 16px 8px` }}
		>
			{isFormLogin ? (
				<FormLogin handleLogin={handleLogin} />
			) : (
				<FormRegistration handleRegister={handleRegister} />
			)}
		</Dialog>
	);
}

PopupLogin.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	handleRegister: PropTypes.func.isRequired,
	handleLogin: PropTypes.func.isRequired,
	isFormLogin: PropTypes.bool.isRequired,
	setIsFormLogin: PropTypes.func.isRequired,
};
