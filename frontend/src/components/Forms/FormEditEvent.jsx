/* Core */
import React, { useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

/* Libraries */
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import startOfToday from 'date-fns/startOfToday';
import getUnixTime from 'date-fns/getUnixTime';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useForm, Controller } from 'react-hook-form';
import { classNames as cn } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

/* Instruments */
import { CalendarsContext } from '../../context';
import styles from './Forms.module.css';

const getCalendarById = (id, calendars) => calendars.find((c) => c.id === id);

export function FormEditEvent({ onEditEvent, onDeleteEvent }) {
	const { allUserCalendars, editableEvent } = useContext(CalendarsContext);

	const circle = useRef(null);
	let currentColor = editableEvent?.calendar?.color;

	useEffect(() => {
		circle.current.style.color = currentColor;
	}, [currentColor]);

	const defaultValues = {
		title: editableEvent.title,
		timeStart: editableEvent.start,
		timeFinish: editableEvent.end,
		allDay: editableEvent.allDay,
		calendar: editableEvent.calendar.id,
		description: editableEvent.description,
	};

	const {
		control,
		formState: { errors, isValid, isDirty },
		handleSubmit,
		getValues,
		setValue,
		clearErrors,
		trigger,
	} = useForm({ defaultValues, mode: 'onChange', reValidateMode: 'onChange' });

	const onSubmit = (formData) => {
		const utcDateStart = zonedTimeToUtc(formData.timeStart);
		const utcDateFinish = zonedTimeToUtc(formData.timeFinish);

		const data = {
			...formData,
			timeStart: utcDateStart,
			timeFinish: utcDateFinish,
			calendar: getCalendarById(formData.calendar, allUserCalendars),
			id: editableEvent.id,
		};

		onEditEvent(data);
	};

	const handleDeleteEvent = () => onDeleteEvent(editableEvent.id);

	const onDropdownChange = () => {
		const values = getValues();
		const currentCalendar = getCalendarById(values.calendar, allUserCalendars);

		currentColor = currentCalendar?.color;
		circle.current.style.color = currentColor;
	};

	const onAllDayClick = (e) => {
		if (e.checked) {
			const { timeStart, timeFinish } = getValues();
			const today = startOfToday();
			let start = today;
			let end = endOfDay(today);

			if (timeStart && timeFinish) {
				start = startOfDay(timeStart);
				end = endOfDay(timeFinish);
			} else if (timeStart) {
				start = startOfDay(timeStart);
				end = endOfDay(timeStart);
			} else if (timeFinish) {
				start = startOfDay(timeFinish);
				end = endOfDay(timeFinish);
			}

			setValue('timeStart', start);
			setValue('timeFinish', end);
		}

		trigger('timeStart', 'timeFinish');
	};

	const onHideCalendar = () => {
		clearErrors('timeStart');
		clearErrors('timeFinish');
		trigger('timeStart', 'timeFinish');
	};

	const getFormErrorMessage = (name) =>
		errors[name] && <small className="p-error">{errors[name].message}</small>;

	const optionItemTemplate = (option) => (
		<div className={styles.item}>
			<div
				style={{ backgroundColor: `${option.color}` }}
				className={styles.marker}
			/>
			<p className={styles.optionText}>{option.name}</p>
		</div>
	);

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.card}>
					<h2 className={cn('text-center', styles.title)}>
						Редактировать событие
					</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label p-input-icon-right">
								<i className="pi pi-pencil" />
								<Controller
									name="title"
									control={control}
									rules={{
										required: 'Поле Название обязательное',
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
											className={cn({
												'p-invalid': fieldState.invalid,
											})}
										/>
									)}
								/>
								{/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
								<label
									htmlFor="title"
									className={cn({ 'p-error': errors.title })}
								>
									Название*
								</label>
							</span>
							{getFormErrorMessage('title')}
						</div>

						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="timeStart"
									control={control}
									rules={{
										required: 'Поле Начало обязательное',
										validate: {
											checkTimeFinish: (value) => {
												const { timeFinish } = getValues();

												return timeFinish
													? getUnixTime(new Date(timeFinish)) >=
															getUnixTime(new Date(value)) ||
															'Дата начала события не может быть позже даты конца'
													: true;
											},
											checkAllDay: (value) => {
												const { allDay } = getValues();
												const start = startOfDay(value);

												if (allDay && value.toString() !== start.toString()) {
													setValue('timeStart', start);
													return 'Нельзя менять время, если проставлено событие на Весь день';
												}

												return true;
											},
										},
									}}
									render={({ field }) => (
										<Calendar
											id={field.name}
											value={field.value}
											onChange={() => field.onChange}
											onHide={onHideCalendar}
											showTime
											showIcon
											selectOtherMonths
											locale="ru"
											{...field}
										/>
									)}
								/>
								<label
									htmlFor="timeStart"
									className={cn({ 'p-error': errors.timeStart })}
								>
									Начало*
								</label>
							</span>
							{getFormErrorMessage('timeStart')}
						</div>

						<div className={styles.field}>
							<span className="p-float-label">
								<Controller
									name="timeFinish"
									control={control}
									rules={{
										required: 'Поле Конец обязательное',
										validate: {
											checkTimeStart: (value) => {
												const { timeStart } = getValues();
												return timeStart
													? getUnixTime(new Date(timeStart)) <=
															getUnixTime(new Date(value)) ||
															'Дата конца события не может быть раньше даты начала'
													: true;
											},
											checkAllDay: (value) => {
												const { allDay } = getValues();
												const end = endOfDay(value);

												if (allDay && value.toString() !== end.toString()) {
													setValue('timeFinish', end);
													return 'Нельзя менять время, если проставлено событие на Весь день';
												}

												return true;
											},
										},
									}}
									render={({ field }) => (
										<Calendar
											id={field.name}
											value={field.value}
											onChange={field.onChange}
											onHide={onHideCalendar}
											showTime
											showIcon
											locale="ru"
											{...field}
										/>
									)}
								/>
								<label
									htmlFor="timeFinish"
									className={cn({ 'p-error': errors.timeFinish })}
								>
									Конец*
								</label>
							</span>
							{getFormErrorMessage('timeFinish')}
						</div>

						<div className={styles.field}>
							<span className="flex align-items-center gap-2">
								<Controller
									name="allDay"
									control={control}
									render={({ field }) => (
										<Checkbox
											id={field.name}
											onChange={(e) => field.onChange(e.checked)}
											onClick={onAllDayClick}
											checked={field.value}
											inputRef={field.ref}
											{...field}
										/>
									)}
								/>
								<label
									htmlFor="allDay"
									className={cn({ 'p-error': errors.allDay })}
								>
									Весь день
								</label>
							</span>
						</div>

						<div className={styles.field}>
							<span className="flex align-items-center gap-2">
								<i
									ref={circle}
									className="pi pi-circle-fill"
									style={{
										fontSize: '1.4rem',
										color: 'var(--primary-color)',
									}}
								/>
								<Controller
									name="calendar"
									control={control}
									rules={{ required: 'Календарь - поле обязательное.' }}
									render={({ field, fieldState }) => (
										<Dropdown
											id={field.name}
											value={field.value}
											placeholder="Выберите календарь*"
											options={allUserCalendars}
											optionLabel="name"
											optionValue="id"
											filter
											filterBy="name"
											itemTemplate={optionItemTemplate}
											focusInputRef={field.ref}
											{...field}
											onChange={(e) => {
												field.onChange(e.value);
												onDropdownChange();
											}}
											className={cn(
												{ 'p-invalid': fieldState.error },
												'w-full md:w-24rem',
												styles.calendar
											)}
										/>
									)}
								/>
							</span>
							{getFormErrorMessage('calendar')}
						</div>

						<div className={styles.field}>
							<Controller
								name="description"
								control={control}
								render={({ field }) => (
									<span className="p-float-label">
										<InputTextarea
											id={field.name}
											{...field}
											rows={4}
											cols={30}
											autoResize
										/>
										<label
											htmlFor={field.name}
											className={cn({ 'p-error': errors.description })}
										>
											Описание
										</label>
									</span>
								)}
							/>
						</div>

						<div className={styles.btnWrapper}>
							<Button
								type="button"
								icon="pi pi-trash"
								className={cn(
									'p-button-rounded p-button-danger p-button-outlined',
									styles.dangerBtn
								)}
								aria-label="Удалить событие"
								onClick={handleDeleteEvent}
							/>

							<Button
								type="submit"
								label="Сохранить"
								disabled={!isValid || !isDirty}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

FormEditEvent.propTypes = {
	onEditEvent: PropTypes.func.isRequired,
	onDeleteEvent: PropTypes.func.isRequired,
};
