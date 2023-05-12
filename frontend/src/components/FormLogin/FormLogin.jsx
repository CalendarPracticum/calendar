import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames as cn } from 'primereact/utils';
import styles from './FormLogin.module.css';

export function FormLogin() {
	const [showMessage, setShowMessage] = useState(false);
	const [formData, setFormData] = useState({});
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
					<h4>И снова здравствуйте!</h4>
					<p style={{ lineHeight: 1.5 }}>
						Вы вошли под именем <b>{formData.name}</b>
					</p>
				</div>
			</Dialog>

			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Вход</h2>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="name"
									control={control}
									rules={{
										minLength: 1,
										maxLength: {
											value: 42,
											message: 'Максимальная длина 42 символа.',
										},
										pattern: {
											value: /^[A-Z0-9._%+-]{1,42}$/i,
											message: 'Латинские буквы, цифры, точка, _, +, - или %',
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
									Имя
								</label>
							</span>
							{getFormErrorMessage('name')}
						</div>
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
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
										/>
									)}
								/>
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

						<Button
							type="submit"
							label="Войти"
							className="mt-2"
							disabled={!isValid}
						/>
					</form>

					<p>
						Или <span className={styles.linkRegistry}>зарегистрируйтесь</span>,
						если у вас ещё нет аккаунта
					</p>
				</div>
			</div>
		</div>
	);
}
