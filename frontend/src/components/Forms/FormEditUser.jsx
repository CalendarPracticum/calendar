import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';
import { classNames as cn } from 'primereact/utils';
import { CurrentUserContext } from '../../context';
import styles from './Forms.module.css';

export function FormEditUser({ setVisible, onUpdateUser, onDeleteUser }) {
	const userContext = useContext(CurrentUserContext);
	const { currentUser } = userContext;
	const { username, email, darkMode, picture } = currentUser;

	const [passwordValue, setPasswordValue] = useState('');

	const defaultValues = {
		email,
		username: `${username || ''}`,
		picture: `${picture || ''}`,
		darkMode,
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		// getValues,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		const preparedData = {
			email: data.email,
			username: data.username || null,
			picture: data.picture || null,
			darkMode: data.darkMode,
		};
		onUpdateUser(preparedData);
		setVisible(false);

		reset();
	};

	const handleDeleteUserClick = (password) => {
		onDeleteUser(password);
		setVisible(false);

		reset();
	};

	const getFormErrorMessage = (fieldName) =>
		errors[fieldName] && (
			<small className="p-error">{errors[fieldName].message}</small>
		);

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Редактировать данные</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="username"
									control={control}
									rules={{
										minLength: 1,
										maxLength: {
											value: 42,
											message: 'Максимальная длина 42 символа.',
										},
										pattern: {
											value: /^[A-ZА-Яа-я0-9._%+-\s]{1,42}$/i,
											message: 'Буквы, цифры, точка, _, +, - или %',
										},
									}}
									render={({ field, fieldState }) => (
										<InputText
											value={username || ''}
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
									htmlFor="username"
									className={cn({ 'p-error': errors.username })}
								>
									Имя
								</label>
							</span>
							{getFormErrorMessage('username')}
						</div>

						<div className={styles.field}>
							<span className="p-float-label">
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
											value={email || ''}
											id={field.name}
											{...field}
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
										/>
									)}
								/>
								<label
									htmlFor="email"
									className={cn({ 'p-error': errors.email })}
								>
									Email*
								</label>
							</span>
							{getFormErrorMessage('email')}
						</div>

						<div className={styles.field}>
							<span className="flex align-items-center gap-2">
								<Controller
									name="darkMode"
									control={control}
									render={({ field }) => (
										<Checkbox
											id={field.name}
											onChange={(e) => field.onChange(e.checked)}
											checked={field.value}
											inputRef={field.ref}
											{...field}
										/>
									)}
								/>
								<label
									htmlFor="darkMode"
									className={cn({ 'p-error': errors.darkMode })}
								>
									Тёмная тема
								</label>
							</span>
						</div>

						<Button
							type="submit"
							label="Изменить данные"
							className="mt-2"
							disabled={!isValid}
						/>
					</form>

					<Divider />
					<h2 className="text-center">
						Для удаления аккаунта введите свой пароль
					</h2>

					<div className={styles.dangerZone}>
						<div className={styles.field}>
							<span className="p-float-label">
								<Password
									className={cn(styles.dangerInput, {
										'p-invalid': passwordValue.length < 8,
									})}
									toggleMask
									inputId="password"
									feedback={false}
									value={passwordValue || ''}
									onChange={(e) => setPasswordValue(e.target.value)}
								/>
								<label htmlFor="password">Пароль</label>
							</span>
						</div>

						<Button
							type="button"
							label="Удалить аккаунт"
							className={cn('p-button-danger', styles.dangerBtn)}
							disabled={passwordValue.length < 8}
							onClick={() => handleDeleteUserClick(passwordValue)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

FormEditUser.propTypes = {
	setVisible: PropTypes.func.isRequired,
	onUpdateUser: PropTypes.func.isRequired,
	onDeleteUser: PropTypes.func.isRequired,
};
