import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export function PopupDialog({
	showMessage,
	setShowMessage,
	isDialogError,
	dialogMessage,
}) {
	const dialogFooter = (
		<div className="flex justify-content-center">
			<Button
				label="OK"
				className="p-button-text"
				autoFocus
				onClick={() => setShowMessage(false)}
			/>
		</div>
	);

	return (
		<Dialog
			visible={showMessage}
			onHide={() => setShowMessage(false)}
			position="top"
			footer={isDialogError ? dialogFooter : ''}
			showHeader={false}
			breakpoints={{ '960px': '80vw' }}
			style={{ width: '30vw' }}
		>
			<div className="flex justify-content-center flex-column pt-6 px-3">
				<i
					className={`pi pi-${isDialogError ? 'times' : 'check'}-circle`}
					style={{
						fontSize: '5rem',
						color: `var(--${isDialogError ? 'red' : 'green'}-500)`,
					}}
				/>
				<h4>{isDialogError ? 'Произошла ошибка!' : 'Успех!'}</h4>
				<p style={{ lineHeight: 1.5 }}>{dialogMessage}</p>
			</div>
		</Dialog>
	);
}

PopupDialog.propTypes = {
	showMessage: PropTypes.bool.isRequired,
	setShowMessage: PropTypes.func.isRequired,
	isDialogError: PropTypes.bool.isRequired,
	dialogMessage: PropTypes.string.isRequired,
};
