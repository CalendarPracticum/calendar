import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormShareCalendar } from '../Forms/FormShareCalendar';

export function PopupShareCalendar({
	visible,
	setVisible,
	handleShare,
  // isShareLoading,
}) {
	return (
		<Dialog visible={visible} onHide={() => setVisible(false)}>
			<FormShareCalendar
				onShareCalendar={handleShare}
				setVisible={setVisible}
        // isShareLoading={isShareLoading}
			/>
		</Dialog>
	);
}

PopupShareCalendar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	handleShare: PropTypes.func.isRequired,
  // isShareLoading: PropTypes.bool.isRequired
};
