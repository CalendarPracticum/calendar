import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormNewCalendar } from '../Forms';

export function PopupNewCalendar({ visible, setVisible, onCreateCalendar }) {
	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			blockScroll
			headerStyle={{ padding: `16px 16px 8px` }}
		>
			<FormNewCalendar onCreateCalendar={onCreateCalendar} />
		</Dialog>
	);
}

PopupNewCalendar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onCreateCalendar: PropTypes.func.isRequired,
};
