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

export function FormShareCalendar({ onShareCalendar, setVisible }) {
	const { editableCalendar } = useContext(CalendarsContext);
	const { id, name, color } = editableCalendar;

	const defaultValues = {
		id,
		name,
		color,
	};

	const {
		control,
		formState: { errors, isValid, isDirty },
		handleSubmit,
		reset,
	} = useForm({ defaultValues, mode: 'onChange' });

	const onSubmit = (data) => {
		onShareCalendar(data);
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
						<div className={`${styles.circle} mb-1`} />
						<p className={styles.nameCalendar}>Акселератор</p>
					</div>

          <div className={cn(
            styles.field,
            styles.guestsTable,
          )}>
            <div className={cn(
              styles.guest,
            )}>
              <div className={cn(
                'flex align-items-center',
                styles.guestInfo,
              )}>
                <Avatar
                  className={cn(
                    styles.guestAvatar,
                  )}
                  shape="circle"
                />

                <p
                  className={cn(
                    'my-0 ml-2',
                    styles.guestEmail,
                  )}
                >
                  hoba@ya.ru
                </p>

                <i
                  className={cn(
                    "pi pi-check",
                    styles.guestIcon,
                  )}
                />
                {/* <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}} /> */}
              </div>

              <button
                className={cn(
                  styles.delButton,
                )}
                type='button'
                onClick={() => {}}
              >
                <i
                  className='pi pi-trash'
                />
              </button>
            </div>
          </div>

					<form
						className={`p-fluid ${styles.form}`}
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className={cn(styles.inputBox)}>
							<div className={styles.field}>
								<span className="p-float-label p-input-icon-right">
									<Controller
										name="title"
										control={control}
										rules={{
											required: 'Поле адреса почты обязательное',
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
                        type="text"
												className={cn(
													{
														'p-invalid': fieldState.invalid,
													},
												)}
											/>
										)}
									/>
                  {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
                  <label
                    htmlFor="title"
                    className={cn({ 'p-error': errors.name })}
                  >
									  Пригласить по email
								  </label>
								</span>
								{getFormErrorMessage('title')}
							</div>

							<Button
								type="submit"
								icon="pi pi-plus"
								disabled={!isValid || !isDirty}
								className={cn(
									'p-button-rounded p-button-outlined'
								)}
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
};
