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
		formState: { errors, isValid, isDirty },
		handleSubmit,
		reset,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		onEditCalendar(data);
		reset();
	};

	const handleDeleteCalendar = () => onDeleteCalendar(id);

	const getFormErrorMessage = (errorName) =>
		errors[errorName] && (
			<small className="p-error">{errors[errorName].message}</small>
		);

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className={cn('text-center', styles.title)}>
						Редактировать календарь
					</h2>

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
								<legend>Выберите цвет календаря*</legend>
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

						<div className={styles.btnWrapper}>
							<Button
								type="button"
								icon="pi pi-trash"
								className={cn(
									'p-button-rounded p-button-danger p-button-outlined',
									styles.dangerBtn
								)}
								aria-label="Удалить календарь"
								onClick={handleDeleteCalendar}
							/>

							<Button
								type="submit"
								label="Сохранить"
								disabled={!isValid || !isDirty}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

FormEditCalendar.propTypes = {
	onEditCalendar: PropTypes.func.isRequired,
	onDeleteCalendar: PropTypes.func.isRequired,
};
