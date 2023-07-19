import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormShareCalendar } from '../Forms/FormShareCalendar';

export function PopupShareCalendar({
	visible,
	setVisible,
	handleShare,
	handleDeleteMate,
}) {
	return (
		<Dialog visible={visible} onHide={() => setVisible(false)}>
			<FormShareCalendar
				onShareCalendar={handleShare}
				setVisible={setVisible}
				handleDeleteMate={handleDeleteMate}
			/>
		</Dialog>
	);
}

PopupShareCalendar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	handleShare: PropTypes.func.isRequired,
	handleDeleteMate: PropTypes.func.isRequired,
};
