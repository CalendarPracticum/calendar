import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import endOfDay from 'date-fns/endOfDay';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames as cn } from 'primereact/utils';
import styles from './FormNewEvent.module.css';

export function FormNewEvent({ setVisible, onCreateEvent, allUserCalendars }) {
  const circle = useRef(null);

  const defaultValues = {
    name: '',
    timeStart: null,
    timeFinish: null,
    allDay: false,
    calendar: null,
    description: '',
  };

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    getValues,
    setValue,
  } = useForm({ defaultValues, mode: 'onChange' });

  const onSubmit = (data) => {
    console.log({ data });
    onCreateEvent(data);
    setVisible(false);

    reset();
  };

  const onDropdownChange = () => {
    const values = getValues();
    const color = values?.calendar?.color;

    circle.current.style.color = color;
  };

  const onAllDayMouseDown = () => {
    // const values = getValues();
    const { timeStart, allDay } = getValues();
    // console.log(2, { values })

    if (!allDay) {
      const endCurrentDay = endOfDay(timeStart);
      setValue('timeFinish', endCurrentDay);
    } else {
      setValue('timeFinish', '')
    }
  }

  const getFormErrorMessage = (name) =>
    errors[name] && <small className="p-error">{errors[name].message}</small>;

  return (
    <div className={styles.paddings}>
      <div className="flex justify-content-center">
        <div className={styles.card}>
          <h2 className="text-center">Создайте новое событие</h2>

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
                  Название
                </label>
              </span>
              {getFormErrorMessage('name')}
            </div>

            <div className={styles.field}>
              <span className="p-float-label">
                <Controller
                  name="timeStart"
                  control={control}
                  rules={{ required: 'Поле Начало обязательное' }}
                  render={({ field }) => (
                    <Calendar
                      id={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      showTime
                      showIcon
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
                    // disabled: {
                    //   value: () => {
                    //     const values = getValues();
                    //     const isAllDay = values?.allDay;
                    //     return isAllDay === true;
                    //   },
                    //   message: 'Дата конца события не может быть раньше даты начала',
                    // },
                  }}
                  render={({ field }) => (
                    <Calendar
                      id={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      // disabledDates={}
                      // disabled={}
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
                      onMouseDown={onAllDayMouseDown}
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
                      optionLabel="name"
                      placeholder="Выберите календарь*"
                      options={allUserCalendars}
                      focusInputRef={field.ref}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.value);
                        onDropdownChange();
                      }}
                      className={cn(
                        { 'p-invalid': fieldState.error },
                        'w-full md:w-24rem'
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

            <Button
              type="submit"
              label="Добавить новое событие"
              className="mt-2"
              disabled={!isValid}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

FormNewEvent.propTypes = {
  setVisible: PropTypes.func.isRequired,
  onCreateEvent: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  allUserCalendars: PropTypes.array.isRequired,
};
