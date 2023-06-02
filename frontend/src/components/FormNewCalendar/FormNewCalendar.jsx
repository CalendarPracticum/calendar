import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames as cn } from 'primereact/utils';
import styles from './FormNewCalendar.module.css';

export function FormNewCalendar({ setVisible, onCreateCalendar }) {
	const defaultValues = {
		name: '',
		color: '',
		description: '',
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		onCreateCalendar(data);
		setVisible(false);

		reset();
	};

	const getFormErrorMessage = (name) =>
		errors[name] && <small className="p-error">{errors[name].message}</small>;

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Создайте новый календарь</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label p-input-icon-right">
								<i className="pi pi-calendar-plus" />
								<Controller
									name="name"
									control={control}
									rules={{
										required: 'Поле Название обязательное',
										minLength: 1,
										maxLength: {
											value: 100,
											message: 'Максимальная длина 100 символа.',
										},
									}}
									render={({ field, fieldState }) => (
										<InputText
											id={field.name}
											{...field}
											autoFocus
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
										/>
									)}
								/>
								{/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
								<label
									htmlFor="name"
									className={cn({ 'p-error': errors.name })}
								>
									Название*
								</label>
							</span>
							{getFormErrorMessage('name')}
						</div>

						<Button
							type="submit"
							label="Добавить новый календарь"
							className="mt-2"
							disabled={!isValid}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}

FormNewCalendar.propTypes = {
	setVisible: PropTypes.func.isRequired,
	onCreateCalendar: PropTypes.func.isRequired,
};
