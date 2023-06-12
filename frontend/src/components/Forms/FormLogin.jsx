import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { classNames as cn } from 'primereact/utils';
import styles from './Forms.module.css';

export function FormLogin({ showFormLogin, handleLogin, message, isError }) {
	const [showMessage, setShowMessage] = useState(false);
	const defaultValues = {
		name: '',
		email: '',
		password: '',
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
	} = useForm({ defaultValues, mode: 'onBlur' });

	const onSubmit = (data) => {
		handleLogin(data).then(() => setShowMessage(true));
		reset();
	};

	const getFormErrorMessage = (name) =>
		errors[name] && <small className="p-error">{errors[name].message}</small>;

	const dialogFooter = (
		<div className="flex justify-content-center">
			<Button
				label="OK"
				className="p-button-text"
				autoFocus
				onClick={() => setShowMessage(false)}
			/>
		</div>
	);

	function handleDialog() {
		if (isError) {
			return (
				<div className="flex justify-content-center flex-column pt-6 px-3">
					<i
						className="pi pi-times-circle"
						style={{ fontSize: '5rem', color: 'var(--red-500)' }}
					/>
					<h4>Произошла ошибка!</h4>
					<p style={{ lineHeight: 1.5 }}>{message}</p>
				</div>
			);
		}

		return (
			<div className="flex justify-content-center flex-column pt-6 px-3">
				<i
					className="pi pi-check-circle"
					style={{ fontSize: '5rem', color: 'var(--green-500)' }}
				/>
				<h4>И снова здравствуйте!</h4>
			</div>
		);
	}

	return (
		<div className={styles.paddings}>
			<Dialog
				visible={showMessage}
				onHide={() => setShowMessage(false)}
				position="top"
				footer={isError ? dialogFooter : ''}
				showHeader={false}
				breakpoints={{ '960px': '80vw' }}
				style={{ width: '30vw' }}
			>
				<>{handleDialog()}</>
			</Dialog>

			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Вход</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label p-input-icon-right">
								<i className="pi pi-envelope" />
								<Controller
									name="email"
									control={control}
									rules={{
										required: 'Обязательное поле Email.',
									}}
									render={({ field, fieldState }) => (
										<InputText
											id={field.name}
											{...field}
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
										/>
									)}
								/>
								{/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
								<label
									htmlFor="email"
									className={cn({ 'p-error': !!errors.email })}
								>
									Email*
								</label>
							</span>
							{getFormErrorMessage('email')}
						</div>
						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="password"
									control={control}
									rules={{
										minLength: 8,
										required: 'Обязательное поле Пароль.',
									}}
									render={({ field, fieldState }) => (
										<Password
											id={field.name}
											{...field}
											toggleMask
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
											feedback={false}
										/>
									)}
								/>
								<label
									htmlFor="password"
									className={cn({ 'p-error': errors.password })}
								>
									Пароль*
								</label>
							</span>
							{getFormErrorMessage('password')}
						</div>

						<Button
							type="submit"
							label="Войти"
							className="mt-2"
							disabled={!isValid}
						/>
					</form>

					<p>
						<button
							type="button"
							className={styles.linkRegistry}
							onClick={() => showFormLogin((prev) => !prev)}
						>
							Зарегистрируйтесь,
						</button>
						если ещё нет аккаунта
					</p>
				</div>
			</div>
		</div>
	);
}

FormLogin.propTypes = {
	showFormLogin: PropTypes.func.isRequired,
	handleLogin: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	isError: PropTypes.bool.isRequired,
};
