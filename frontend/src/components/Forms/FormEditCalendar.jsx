import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { classNames as cn } from 'primereact/utils';
import { CurrentUserContext } from '../../context';
import styles from './Forms.module.css';
import { Color } from '../../utils/constants';

export function FormEditCalendar({ onEditCalendar, onDeleteCalendar }) {
	const userContext = useContext(CurrentUserContext);
	const { editableCalendar } = userContext;
	const { id, name, color, description } = editableCalendar;

	const defaultValues = {
		id,
		name,
		color,
		description,
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		onEditCalendar(data);
		reset();
	};

	const handleDeleteCalendar = () => {
		onDeleteCalendar(id);
		reset();
	};

	const getFormErrorMessage = (errorName) =>
		errors[errorName] && (
			<small className="p-error">{errors[errorName].message}</small>
		);

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Редактировать календарь</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label p-input-icon-right">
								<i className="pi pi-pencil" />
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

						<div className={styles.field}>
							<fieldset className={styles.colorTable}>
								<legend>Выберите один из вариантов*</legend>
								{Object.values(Color).map((hexColor) => (
									<div key={hexColor} className="field-radiobutton">
										<Controller
											name="color"
											control={control}
											rules={{ required: true }}
											render={({ field, fieldState }) => (
												<RadioButton
													value={hexColor}
													inputId={hexColor}
													onChange={(e) => field.onChange(e.value)}
													className={cn({ 'p-invalid': fieldState.invalid })}
													checked={field.value === hexColor}
												/>
											)}
										/>
										<label
											htmlFor={hexColor}
											className={styles.color}
											style={{ backgroundColor: `${hexColor}` }}
										>
											{/* `${hexColor}` */}
										</label>
									</div>
								))}
							</fieldset>
							{getFormErrorMessage('color')}
						</div>

						<Button
							type="submit"
							label="Редактировать календарь"
							className="mt-2"
							disabled={!isValid}
						/>
					</form>

					<Button
						type="button"
						className={cn(
							'p-button-outlined p-button-danger',
							styles.dangerBtn
						)}
						label="Удалить календарь"
						onClick={() => handleDeleteCalendar}
					/>
				</div>
			</div>
		</div>
	);
}

FormEditCalendar.propTypes = {
	onEditCalendar: PropTypes.func.isRequired,
	onDeleteCalendar: PropTypes.func.isRequired,
};
