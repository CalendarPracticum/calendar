import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export function PopupAskToRegister({
	visible,
	setVisible,
	setVisibleRegister,
	setShowFormLogin,
}) {
	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			draggable={false}
			className="flex justify-content-center"
			headerStyle={{ padding: '20px', height: '60px' }}
		>
			<div
				className="flex justify-content-center flex-column pb-4 px-4"
				style={{
					textAlign: 'center',
				}}
			>
				<h2
					className="mt-0 mb-6"
					style={{
						fontFamily: 'Roboto',
						maxWidth: '320px',
						fontSize: '20px',
						fontWeight: '500',
						wordWrap: 'break-word',
					}}
				>
					Чтобы добавить запись <br /> в календарь, необходимо
					зарегистрироваться
				</h2>

				<Button
					label="Не сейчас"
					className="p-button-outlined"
					onClick={() => setVisible(false)}
				/>

				<Button
					type="submit"
					label="Попробовать"
					className="mt-3"
					onClick={() => {
						setVisible(false);
						setShowFormLogin(false);
						setVisibleRegister(true);
					}}
				/>
			</div>
		</Dialog>
	);
}

PopupAskToRegister.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	setVisibleRegister: PropTypes.func.isRequired,
	setShowFormLogin: PropTypes.func.isRequired,
};
