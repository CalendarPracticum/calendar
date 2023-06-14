// eslint-disable-next-line no-unused-vars
import React, { useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import startOfToday from 'date-fns/startOfToday';
import parseISO from 'date-fns/parseISO';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames as cn } from 'primereact/utils';
import styles from './Forms.module.css';
import { CurrentUserContext } from '../../context';

const getCalendarByName = (name, calendars) =>
	calendars.find((c) => c.name === name);

export function FormEditEvent({ setVisible, onEditEvent, onDeleteEvent }) {
	const userContext = useContext(CurrentUserContext);
	const { allUserCalendars, editableEvent } = userContext;

	const circle = useRef(null);
	let currentColor = editableEvent?.calendar?.color;

	useEffect(() => {
		circle.current.style.color = currentColor;
	}, [currentColor]);

	const defaultValues = {
		name: editableEvent.title,
		timeStart: parseISO(editableEvent.start),
		timeFinish: parseISO(editableEvent.end),
		allDay: editableEvent.allDay,
		calendar: editableEvent.calendar.name,
		description: editableEvent.description,
	};

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		getValues,
		setValue,
		clearErrors,
		trigger,
	} = useForm({ defaultValues, mode: 'onChange', reValidateMode: 'onChange' });

	const onSubmit = (formData) => {
		const data = {
			...formData,
			calendar: getCalendarByName(formData.calendar, allUserCalendars),
			id: editableEvent.id,
		};

		onEditEvent(data);
		setVisible(false);

		reset();
	};

	const handleDeleteEvent = (id) => {
		onDeleteEvent(id);
		setVisible(false);

		reset();
	};

	const onDropdownChange = () => {
		const values = getValues();
		const currentCalendar = getCalendarByName(
			values.calendar,
			allUserCalendars
		);

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
		} else {
			setValue('timeStart', null);
			setValue('timeFinish', null);
		}

		clearErrors('timeStart');
		clearErrors('timeFinish');
		trigger('timeStart', 'timeFinish');
	};

	const setAllDayFalse = () => setValue('allDay', false);

	const onHideCalendar = () => {
		// TODO: написать логику, завязанную на allDay
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
					<h2 className="text-center">Редактировать/удалить событие</h2>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`p-fluid ${styles.form}`}
					>
						<div className={styles.field}>
							<span className="p-float-label p-input-icon-right">
								<i className="pi pi-pencil" />
								<Controller
									name="name"
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
									htmlFor="name"
									className={cn({ 'p-error': errors.name })}
								>
									Название*
								</label>
							</span>
							{getFormErrorMessage('name')}
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
													? timeFinish > value ||
															'Дата начала события не может быть позже даты конца'
													: true;
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
											showButtonBar
											selectOtherMonths
											onClearButtonClick={setAllDayFalse}
											onTodayButtonClick={setAllDayFalse}
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
													? timeStart < value ||
															'Дата конца события не может быть раньше даты начала'
													: true;
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
											showButtonBar
											onClearButtonClick={setAllDayFalse}
											onTodayButtonClick={setAllDayFalse}
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
							<span className="flex align-items-center gap-3">
								<i
									ref={circle}
									className="pi pi-circle-fill"
									style={{
										fontSize: '2.75em',
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
											optionValue="name"
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

						<div className={styles.deleteWrapper}>
							<Button
								type="button"
								icon="pi pi-times"
								className="p-button-rounded p-button-danger p-button-text"
								aria-label="Удалить событие"
								onClick={() => handleDeleteEvent(editableEvent.id)}
							/>
							<p>Удалить событие</p>
						</div>

						<Button
							type="submit"
							label="Редактировать событие"
							className="mt-2"
							disabled={!isValid}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}

FormEditEvent.propTypes = {
	setVisible: PropTypes.func.isRequired,
	onEditEvent: PropTypes.func.isRequired,
	onDeleteEvent: PropTypes.func.isRequired,
};
