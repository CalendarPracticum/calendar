import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames as cn } from 'primereact/utils';
import styles from './Forms.module.css';

export function FormLogin({ showFormLogin, handleLogin }) {
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
		handleLogin(data);
		reset();
	};

	const getFormErrorMessage = (name) =>
		errors[name] && <small className="p-error">{errors[name].message}</small>;

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className={cn('text-center', styles.title)}>Вход</h2>

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
						{`${'\u00A0'}если ещё нет аккаунта`}
					</p>
				</div>
			</div>
		</div>
	);
}

FormLogin.propTypes = {
	showFormLogin: PropTypes.func.isRequired,
	handleLogin: PropTypes.func.isRequired,
};
