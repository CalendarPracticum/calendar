import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormLogin } from '../Forms/FormLogin';
import { FormRegistration } from '../Forms';

export function PopupLogin({
	visible,
	setVisible,
	handleRegister,
	handleLogin,
}) {
	const [showFormLogin, setShowFormLogin] = useState(true);

	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			blockScroll
			headerStyle={{ padding: `16px 16px 8px` }}
		>
			{showFormLogin ? (
				<FormLogin showFormLogin={setShowFormLogin} handleLogin={handleLogin} />
			) : (
				<FormRegistration
					showFormLogin={setShowFormLogin}
					handleRegister={handleRegister}
				/>
			)}
		</Dialog>
	);
}

PopupLogin.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	handleRegister: PropTypes.func.isRequired,
	handleLogin: PropTypes.func.isRequired,
};
