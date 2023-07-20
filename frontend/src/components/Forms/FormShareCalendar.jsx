/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { useForm, Controller } from 'react-hook-form';
import { classNames as cn } from 'primereact/utils';
import styles from './Forms.module.css';
import { CalendarsContext } from '../../context';
import { PICTURE_URL } from '../../utils/api/commonApi';

export function FormShareCalendar({
	onShareCalendar,
	setVisible,
	handleDeleteMate,
}) {
	const { editableCalendar, team } = useContext(CalendarsContext);
	const { id, name, color } = editableCalendar;

	const defaultValues = {
		email: '',
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		const result = {
			...data,
			id,
			name,
			color,
		};
		onShareCalendar(result);
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
					<div className="flex align-items-center gap-2">
						<h2 className={styles.title}>Поделиться календарём</h2>
						<Tooltip target=".info" style={{ maxWidth: '382px' }} />
						<span
							className="info align-self-start mt-2"
							data-pr-tooltip="
              Добавляя участников к этому календарю,
              вы автоматически поделитесь с ними всеми событиями,
              закреплёнными в этом календаре.
              Если вы хотите этого избежать, создайте отдельный
              календарь для планирования командных мероприятий.
            "
						>
							<i className="pi pi-info-circle" />
						</span>
					</div>

					<div className="flex mb-4">
						<div
							className={cn(styles.circle, 'mb-1')}
							style={{
								backgroundColor: color,
							}}
						/>
						<p className={styles.nameCalendar}>{name}</p>
					</div>

					{team.length > 0 && (
						<div className={cn(styles.field, styles.guestsTable)}>
							{team.map((mate) => (
								<div className={cn(styles.guest)} key={mate.email}>
									<div
										className={cn('flex align-items-center', styles.guestInfo)}
									>
										<Avatar
											icon={mate.profile_picture ? '' : 'pi pi-user'}
											image={`${PICTURE_URL}${mate.profile_picture}` || ''}
											className={cn(styles.guestAvatar)}
											shape="circle"
										/>

										<p className={cn('my-0 ml-2', styles.guestEmail)}>
											{mate.email}
										</p>

										{mate.infoIcon ? (
											mate.infoIcon === 'load' ? (
												<i
													className={cn(
														'pi pi-spin pi-spinner',
														styles.guestIcon
													)}
												/>
											) : mate.infoIcon === 'success' ? (
												<i className={cn('pi pi-check', styles.guestIcon)} />
											) : (
												<i className={cn('pi pi-times', styles.guestIcon)} />
											)
										) : (
											<i className={cn('pi pi-check', styles.guestIcon)} />
										)}
									</div>

									{mate.infoIcon ? (
										mate.infoIcon === 'success' && (
											<button
												className={cn(styles.delButton)}
												type="button"
												onClick={() => {
													handleDeleteMate({ id, email: mate.email });
												}}
											>
												<i className="pi pi-trash" />
											</button>
										)
									) : (
										<button
											className={cn(styles.delButton)}
											type="button"
											onClick={() => {
												handleDeleteMate({ id, email: mate.email });
											}}
										>
											<i className="pi pi-trash" />
										</button>
									)}
								</div>
							))}
						</div>
					)}

					<form
						className={`p-fluid ${styles.form}`}
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className={cn(styles.inputBox)}>
							<div className={styles.field}>
								<span className="p-float-label p-input-icon-right">
									<Controller
										name="email"
										control={control}
										rules={{
											required: 'Обязательное поле Email.',
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
												message:
													'Не корректный email. Например: example@email.ru',
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
										htmlFor="email"
										className={cn({ 'p-error': errors.name })}
									>
										Пригласить по email
									</label>
								</span>
								{getFormErrorMessage('email')}
							</div>

							<Button
								type="submit"
								icon="pi pi-plus"
								disabled={!isValid}
								className={cn('p-button-rounded p-button-outlined')}
							/>
						</div>

						<Button
							type="button"
							onClick={() => setVisible(false)}
							label="Сохранить"
						/>
					</form>
				</div>
			</div>
		</div>
	);
}

FormShareCalendar.propTypes = {
	onShareCalendar: PropTypes.func.isRequired,
	setVisible: PropTypes.func.isRequired,
	handleDeleteMate: PropTypes.func.isRequired,
};
