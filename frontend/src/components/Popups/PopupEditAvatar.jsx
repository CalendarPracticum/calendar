import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormEditAvatar } from '../Forms';

export function PopupEditAvatar({
	visible,
	setVisible,
	onEditAvatar,
	onDeleteAvatar,
}) {
	return (
		<Dialog visible={visible} onHide={() => setVisible(false)} blockScroll>
			<FormEditAvatar
				onEditAvatar={onEditAvatar}
				onDeleteAvatar={onDeleteAvatar}
			/>
		</Dialog>
	);
}

PopupEditAvatar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onEditAvatar: PropTypes.func.isRequired,
	onDeleteAvatar: PropTypes.func.isRequired,
};
