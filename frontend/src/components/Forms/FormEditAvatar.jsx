import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { classNames as cn } from 'primereact/utils';
import { CurrentUserContext } from '../../context';
import styles from './Forms.module.css';
import { updateUserData } from '../../utils/api/auth';
import { BASE_URL } from '../../utils/constants';

// { onEditAvatar }
export function FormEditAvatar({ setVisible, onDeleteAvatar }) {
	const userContext = useContext(CurrentUserContext);
	const { setCurrentUser } = userContext;

	const handleDeleteAvatar = () => onDeleteAvatar();

	const customBase64Uploader = async (event) => {
		// convert file to base64 encoded
		const file = event.files[0];
		const reader = new FileReader();
		// eslint-disable-next-line prefer-const
		let blob = await fetch(file.objectURL).then((r) => r.blob()); // blob:url
		reader.readAsDataURL(blob);
		// eslint-disable-next-line func-names
		reader.onloadend = function () {
			const base64data = reader.result;
			const data = { picture: base64data };
			updateUserData(data).then((result) => {
				const picture = `${BASE_URL}${result.profile_picture}`;

				setCurrentUser({
					email: result.email,
					username: result.username,
					picture,
					darkMode: result.settings.dark_mode,
				});

				setVisible(false);
			});
		};
	};

	return (
		<div className={styles.paddings}>
			<div className="flex justify-content-center">
				<div className={styles.avatar}>
					<h2 className="text-center">Загрузить аватар</h2>

					<div>
						<FileUpload
							url={`${BASE_URL}/api/v1/users/me/`}
							name=""
							accept="image/*"
							maxFileSize={1000000}
							emptyTemplate={<p className="m-0">Перетащите сюда файл</p>}
							customUpload
							uploadHandler={customBase64Uploader}
							chooseLabel="Выбрать"
							uploadLabel="Сохранить"
							cancelLabel="Отменить"
							onUpload={() => console.log('onUpload')}
							onBeforeSend={() => console.log('onBeforeSend')}
							onError={() => console.log('onError')}
							onRemove={() => console.log('onRemove')}
						/>

						<Button
							type="button"
							className={cn(
								'p-button-outlined p-button-danger',
								styles.dangerBtn
							)}
							label="Удалить аватар"
							onClick={handleDeleteAvatar}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

FormEditAvatar.propTypes = {
	setVisible: PropTypes.func.isRequired,
	// onEditAvatar: PropTypes.func.isRequired,
	onDeleteAvatar: PropTypes.func.isRequired,
};
