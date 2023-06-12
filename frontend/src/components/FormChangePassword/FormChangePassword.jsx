import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
// import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames as cn } from 'primereact/utils';
import styles from './FormChangePassword.module.css';

// , message, isError
export function FormChangePassword({ setVisible, onChangePassword }) {
	// const [showMessage, setShowMessage] = useState(false);
	// const [formData, setFormData] = useState({});
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
		// setFormData(data);
		onChangePassword(data);
		setVisible(false);

		reset();
	};

	const getFormErrorMessage = (name) =>
		errors[name] && <small className="p-error">{errors[name].message}</small>;

	// const dialogFooter = (
	//   <div className="flex justify-content-center">
	//     <Button
	//       label="OK"
	//       className="p-button-text"
	//       autoFocus
	//       onClick={() => setShowMessage(false)}
	//     />
	//   </div>
	// );
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

	// function handleDialog() {
	//   if (isError) {
	//     return (
	//       <div className="flex justify-content-center flex-column pt-6 px-3">
	//         <i
	//           className="pi pi-times-circle"
	//           style={{ fontSize: '5rem', color: 'var(--red-500)' }}
	//         />
	//         <h4>Произошла ошибка!</h4>
	//         <p style={{ lineHeight: 1.5 }}>{message}</p>
	//       </div>
	//     );
	//   }

	//   return (
	//     <div className="flex justify-content-center flex-column pt-6 px-3">
	//       <i
	//         className="pi pi-check-circle"
	//         style={{ fontSize: '5rem', color: 'var(--green-500)' }}
	//       />
	//       <h4>Поздравляем!</h4>
	//       <p style={{ lineHeight: 1.5 }}>Вы успешнео изменили пароль!</p>
	//     </div>
	//   );
	// }

	return (
		<div className={styles.paddings}>
			{/* <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={isError ? dialogFooter : ''}
        showHeader={false}
        breakpoints={{ '960px': '80vw' }}
        style={{ width: '30vw' }}
      >
        <>{handleDialog()}</>
      </Dialog> */}

			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className="text-center">Пароли и безопасность</h2>

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
								{/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
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
							label="Сменить пароль"
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
	setVisible: PropTypes.func.isRequired,
	onChangePassword: PropTypes.func.isRequired,
	// message: PropTypes.string.isRequired,
	// isError: PropTypes.bool.isRequired,
};
