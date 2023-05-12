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
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm({ defaultValues });

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
	const passwordHeader = <h6>Pick a password</h6>;
	const passwordFooter = (
		<>
			<Divider />
			<p className="mt-2">Suggestions</p>
			<ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
				<li>At least one lowercase</li>
				<li>At least one uppercase</li>
				<li>At least one numeric</li>
				<li>Minimum 8 characters</li>
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
					<h5>Registration Successful!</h5>
					<p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
						Your account is registered under name <b>{formData.name}</b>
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
									rules={{ required: 'Name is required.' }}
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
									Имя*
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
										required: 'Email is required.',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
											message: 'Invalid email address. E.g. example@email.com',
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
										required: 'Password is required.',
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
											message: 'Invalid password',
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

						<Button type="submit" label="Войти" className="mt-2" />
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
