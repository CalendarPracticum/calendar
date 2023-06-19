import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormEditCalendar } from '../Forms';

export function PopupEditCalendar({
	visible,
	setVisible,
	onEditCalendar,
	onDeleteCalendar,
}) {
	return (
		<Dialog visible={visible} onHide={() => setVisible(false)} blockScroll>
			<FormEditCalendar
				onEditCalendar={onEditCalendar}
				onDeleteCalendar={onDeleteCalendar}
			/>
		</Dialog>
	);
}

PopupEditCalendar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onEditCalendar: PropTypes.func.isRequired,
	onDeleteCalendar: PropTypes.func.isRequired,
};
