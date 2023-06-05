import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames as cn } from 'primereact/utils';
import styles from './FormEditUser.module.css';

export function FormEditUser({ setVisible, onEditUser, onDeleteUser }) {
  const defaultValues = {
    name: '',
  };

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    getValues,
  } = useForm({ defaultValues, mode: 'onChange' });

  return (
    <div>FormEditUser</div>
  )
}

FormEditUser.propTypes = {
  setVisible: PropTypes.func.isRequired,
  onEditUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};
