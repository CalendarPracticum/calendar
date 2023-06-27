/* Core */
import React from 'react';
import PropTypes from 'prop-types';

/* Libraries */
import { useForm, Controller } from 'react-hook-form';
import { classNames as cn } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

/* Instruments */
import styles from './Forms.module.css';

export function FormChangePassword({ onChangePassword }) {
	const defaultValues = {
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		watch,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		onChangePassword(data);
		reset();
	};

	const getFormErrorMessage = (name) =>
		errors[name] && <small className="p-error">{errors[name].message}</small>;

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
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className={cn('text-center', styles.title)}>
						Пароли и безопасность
					</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="currentPassword"
									control={control}
									rules={{
										minLength: 8,
										required: 'Обязательное поле Старый пароль.',
									}}
									render={({ field, fieldState }) => (
										<Password
											id={field.name}
											{...field}
											feedback={false}
											autoFocus
											toggleMask
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
										/>
									)}
								/>
								{/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
								<label
									htmlFor="currentPassword"
									className={cn({ 'p-error': errors.currentPassword })}
								>
									Старый пароль*
								</label>
							</span>
							{getFormErrorMessage('currentPassword')}
						</div>

						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="newPassword"
									control={control}
									rules={{
										required: 'Обязательное поле Новый пароль.',
										maxLength: {
											value: 40,
											message: 'Максимальная длина 40 символа.',
										},
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
									htmlFor="newPassword"
									className={cn({ 'p-error': errors.newPassword })}
								>
									Новый пароль*
								</label>
							</span>
							{getFormErrorMessage('newPassword')}
						</div>

						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="confirmNewPassword"
									control={control}
									rules={{
										required: 'Обязательное поле Подтвердите пароль.',
										validate: (value) =>
											watch('newPassword') === value ||
											'Пароли должны совпадать!',
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
									htmlFor="confirmNewPassword"
									className={cn({ 'p-error': errors.confirmNewPassword })}
								>
									Повторите новый пароль*
								</label>
							</span>
							{getFormErrorMessage('confirmNewPassword')}
						</div>

						<Button
							type="submit"
							label="Сохранить"
							className="mt-2"
							disabled={!isValid}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}

FormChangePassword.propTypes = {
	onChangePassword: PropTypes.func.isRequired,
};
