import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { classNames as cn } from 'primereact/utils';
import { CurrentUserContext } from '../../context';
import styles from './Forms.module.css';

export function FormEditAvatar({ onEditAvatar, onDeleteAvatar }) {
	const userContext = useContext(CurrentUserContext);
	const { currentUser } = userContext;
	const { picture } = currentUser;

	const defaultValues = {
		picture: `${picture || ''}`,
	};

	const {
		// control,
		// formState: { isValid, isDirty },
		handleSubmit,
		reset,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		const preparedData = {
			picture: data.picture || null,
		};
		onEditAvatar(preparedData);
		reset();
	};

	const handleDeleteAvatarClick = () => onDeleteAvatar();

	// const getFormErrorMessage = (fieldName) =>
	//   errors[fieldName] && (
	//     <small className="p-error">{errors[fieldName].message}</small>
	//   );

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Редактировать аватар</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<Button
							type="submit"
							label="Изменить аватар"
							className="mt-2"
							// disabled={!isValid || !isDirty}
						/>
					</form>

					<Divider />
					<h2 className="text-center">Удалить аватар</h2>

					<Button
						type="button"
						label="Удалить аватар"
						className={cn('p-button-danger', styles.dangerBtn)}
						onClick={() => handleDeleteAvatarClick()}
					/>
				</div>
			</div>
		</div>
	);
}

FormEditAvatar.propTypes = {
	onEditAvatar: PropTypes.func.isRequired,
	onDeleteAvatar: PropTypes.func.isRequired,
};
