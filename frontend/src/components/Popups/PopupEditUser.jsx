import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormEditUser } from '../Forms';

export function PopupEditUser({
	visible,
	setVisible,
	onUpdateUser,
	onDeleteUser,
}) {
	return (
		<Dialog visible={visible} onHide={() => setVisible(false)} blockScroll>
			<FormEditUser onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} />
		</Dialog>
	);
}

PopupEditUser.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onUpdateUser: PropTypes.func.isRequired,
	onDeleteUser: PropTypes.func.isRequired,
};
