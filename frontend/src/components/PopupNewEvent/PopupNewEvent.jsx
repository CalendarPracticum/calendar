import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames as cn } from 'primereact/utils';
import styles from './PopupNewEvent.module.css';

export function PopupNewEvent({ visible, setVisible }) {
  const defaultValues = {
    name: '',
    timeStart: '',
    timeFinish: '',
    allDay: false,
    calendar: null,
    description: '',
  };

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ defaultValues, mode: 'onBlur' });

  const onSubmit = (data) => {
    console.log({ data });
    setVisible(false);

    reset();
  };

  const getFormErrorMessage = (name) =>
    errors[name] && <small className="p-error">{errors[name].message}</small>;

  const handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      setVisible(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
      onMaskClick={handleOverlayClick}
      blockScroll
    >
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
                  <i className="pi pi-calendar-plus" />
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
                <span className="flex align-items-center gap-2">
                  <Controller
                    name="allDay"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={field.name}
                        onChange={(e) => field.onChange(e.checked)}
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
    </Dialog>
  );
}

PopupNewEvent.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};
