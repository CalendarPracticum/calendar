import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames as cn } from 'primereact/utils';
import styles from './FormRegistration.module.css';

export function FormRegistration({ showFormLogin }) {
	const [showMessage, setShowMessage] = useState(false);
	const [formData, setFormData] = useState({});
	const defaultValues = {
		email: '',
		password: '',
		confirmPassword: '',
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		watch,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		setFormData(data);
		setShowMessage(true);

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
	const passwordHeader = <h4>Введите пароль</h4>;
	const passwordFooter = (
		<>
			<Divider />
			<p className="mt-2">Правила для пароля:</p>
			<ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
				<li>Хотя бы 1 маленькая буква английского алфавита</li>
				<li>Хотя бы 1 заглавная буква английского алфавита</li>
				<li>Хотя бы одна цифра</li>
				<li>Минимум 8 символов</li>
			</ul>
		</>
	);

	return (
		<div className={styles.paddings}>
			<Dialog
				visible={showMessage}
				onHide={() => setShowMessage(false)}
				position="top"
				footer={dialogFooter}
				showHeader={false}
				breakpoints={{ '960px': '80vw' }}
				style={{ width: '30vw' }}
			>
				<div className="flex justify-content-center flex-column pt-6 px-3">
					<i
						className="pi pi-check-circle"
						style={{ fontSize: '5rem', color: 'var(--green-500)' }}
					/>
					<h4>Поздравляем!</h4>
					<p style={{ lineHeight: 1.5 }}>
						Вы зарегистрировались c Email <b>{formData.email}</b>
					</p>
				</div>
			</Dialog>

			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Регистрация</h2>

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
										required: 'Обязательное поле Пароль.',
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,42})/,
											message: 'Не корректный пароль',
										},
									}}
									render={({ field, fieldState }) => (
										<Password
											id={field.name}
											{...field}
											toggleMask
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
											header={passwordHeader}
											footer={passwordFooter}
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
						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="confirmPassword"
									control={control}
									rules={{
										required: 'Обязательное поле.',
										validate: (value) =>
											watch('password') === value || 'Пароли должны совпадать!',
									}}
									render={({ field, fieldState }) => (
										<Password
											id={field.name}
											{...field}
											feedback={false}
											toggleMask
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
										/>
									)}
								/>
								<label
									htmlFor="confirmPassword"
									className={cn({ 'p-error': errors.confirmPassword })}
								>
									Повторите пароль*
								</label>
							</span>
							{getFormErrorMessage('confirmPassword')}
						</div>

						<Button
							type="submit"
							label="Зарегистрироваться"
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
							Войдите,
						</button>
						если у вас уже есть аккаунт
					</p>
				</div>
			</div>
		</div>
	);
}

FormRegistration.propTypes = {
	showFormLogin: PropTypes.func.isRequired,
};
