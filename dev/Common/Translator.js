import ko from 'ko';
import { Notification, UploadErrorCode } from 'Common/Enums';
import { langLink } from 'Common/Links';

let I18N_DATA = window.rainloopI18N || {};

const doc = document,
I18N_NOTIFICATION_DATA = {},
I18N_NOTIFICATION_MAP = [
	[Notification.InvalidToken, 'NOTIFICATIONS/INVALID_TOKEN'],
	[Notification.InvalidToken, 'NOTIFICATIONS/INVALID_TOKEN'],
	[Notification.AuthError, 'NOTIFICATIONS/AUTH_ERROR'],
	[Notification.AccessError, 'NOTIFICATIONS/ACCESS_ERROR'],
	[Notification.ConnectionError, 'NOTIFICATIONS/CONNECTION_ERROR'],
	[Notification.CaptchaError, 'NOTIFICATIONS/CAPTCHA_ERROR'],
	[Notification.SocialFacebookLoginAccessDisable, 'NOTIFICATIONS/SOCIAL_FACEBOOK_LOGIN_ACCESS_DISABLE'],
	[Notification.SocialTwitterLoginAccessDisable, 'NOTIFICATIONS/SOCIAL_TWITTER_LOGIN_ACCESS_DISABLE'],
	[Notification.SocialGoogleLoginAccessDisable, 'NOTIFICATIONS/SOCIAL_GOOGLE_LOGIN_ACCESS_DISABLE'],
	[Notification.DomainNotAllowed, 'NOTIFICATIONS/DOMAIN_NOT_ALLOWED'],
	[Notification.AccountNotAllowed, 'NOTIFICATIONS/ACCOUNT_NOT_ALLOWED'],

	[Notification.AccountTwoFactorAuthRequired, 'NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_REQUIRED'],
	[Notification.AccountTwoFactorAuthError, 'NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_ERROR'],

	[Notification.CouldNotSaveNewPassword, 'NOTIFICATIONS/COULD_NOT_SAVE_NEW_PASSWORD'],
	[Notification.CurrentPasswordIncorrect, 'NOTIFICATIONS/CURRENT_PASSWORD_INCORRECT'],
	[Notification.NewPasswordShort, 'NOTIFICATIONS/NEW_PASSWORD_SHORT'],
	[Notification.NewPasswordWeak, 'NOTIFICATIONS/NEW_PASSWORD_WEAK'],
	[Notification.NewPasswordForbidden, 'NOTIFICATIONS/NEW_PASSWORD_FORBIDDENT'],

	[Notification.ContactsSyncError, 'NOTIFICATIONS/CONTACTS_SYNC_ERROR'],

	[Notification.CantGetMessageList, 'NOTIFICATIONS/CANT_GET_MESSAGE_LIST'],
	[Notification.CantGetMessage, 'NOTIFICATIONS/CANT_GET_MESSAGE'],
	[Notification.CantDeleteMessage, 'NOTIFICATIONS/CANT_DELETE_MESSAGE'],
	[Notification.CantMoveMessage, 'NOTIFICATIONS/CANT_MOVE_MESSAGE'],
	[Notification.CantCopyMessage, 'NOTIFICATIONS/CANT_MOVE_MESSAGE'],

	[Notification.CantSaveMessage, 'NOTIFICATIONS/CANT_SAVE_MESSAGE'],
	[Notification.CantSendMessage, 'NOTIFICATIONS/CANT_SEND_MESSAGE'],
	[Notification.InvalidRecipients, 'NOTIFICATIONS/INVALID_RECIPIENTS'],

	[Notification.CantSaveFilters, 'NOTIFICATIONS/CANT_SAVE_FILTERS'],
	[Notification.CantGetFilters, 'NOTIFICATIONS/CANT_GET_FILTERS'],
	[Notification.FiltersAreNotCorrect, 'NOTIFICATIONS/FILTERS_ARE_NOT_CORRECT'],

	[Notification.CantCreateFolder, 'NOTIFICATIONS/CANT_CREATE_FOLDER'],
	[Notification.CantRenameFolder, 'NOTIFICATIONS/CANT_RENAME_FOLDER'],
	[Notification.CantDeleteFolder, 'NOTIFICATIONS/CANT_DELETE_FOLDER'],
	[Notification.CantDeleteNonEmptyFolder, 'NOTIFICATIONS/CANT_DELETE_NON_EMPTY_FOLDER'],
	[Notification.CantSubscribeFolder, 'NOTIFICATIONS/CANT_SUBSCRIBE_FOLDER'],
	[Notification.CantUnsubscribeFolder, 'NOTIFICATIONS/CANT_UNSUBSCRIBE_FOLDER'],

	[Notification.CantSaveSettings, 'NOTIFICATIONS/CANT_SAVE_SETTINGS'],
	[Notification.CantSavePluginSettings, 'NOTIFICATIONS/CANT_SAVE_PLUGIN_SETTINGS'],

	[Notification.DomainAlreadyExists, 'NOTIFICATIONS/DOMAIN_ALREADY_EXISTS'],

	[Notification.CantInstallPackage, 'NOTIFICATIONS/CANT_INSTALL_PACKAGE'],
	[Notification.CantDeletePackage, 'NOTIFICATIONS/CANT_DELETE_PACKAGE'],
	[Notification.InvalidPluginPackage, 'NOTIFICATIONS/INVALID_PLUGIN_PACKAGE'],
	[Notification.UnsupportedPluginPackage, 'NOTIFICATIONS/UNSUPPORTED_PLUGIN_PACKAGE'],

	[Notification.DemoSendMessageError, 'NOTIFICATIONS/DEMO_SEND_MESSAGE_ERROR'],
	[Notification.DemoAccountError, 'NOTIFICATIONS/DEMO_ACCOUNT_ERROR'],

	[Notification.AccountAlreadyExists, 'NOTIFICATIONS/ACCOUNT_ALREADY_EXISTS'],
	[Notification.AccountDoesNotExist, 'NOTIFICATIONS/ACCOUNT_DOES_NOT_EXIST'],

	[Notification.MailServerError, 'NOTIFICATIONS/MAIL_SERVER_ERROR'],
	[Notification.InvalidInputArgument, 'NOTIFICATIONS/INVALID_INPUT_ARGUMENT'],
	[Notification.UnknownNotification, 'NOTIFICATIONS/UNKNOWN_ERROR'],
	[Notification.UnknownError, 'NOTIFICATIONS/UNKNOWN_ERROR']
];

export const trigger = ko.observable(false);

/**
 * @param {string} key
 * @param {Object=} valueList
 * @param {string=} defaulValue
 * @returns {string}
 */
export function i18n(key, valueList, defaulValue) {
	let valueName = '',
		result = I18N_DATA[key];

	if (undefined === result) {
		result = undefined === defaulValue ? key : defaulValue;
	}

	if (null != valueList) {
		for (valueName in valueList) {
			if (Object.prototype.hasOwnProperty.call(valueList, valueName)) {
				result = result.replace('%' + valueName + '%', valueList[valueName]);
			}
		}
	}

	return result;
}

const i18nToNode = element => {
	const key = element.dataset.i18n;
	if (key) {
		if ('[' === key.substr(0, 1)) {
			switch (key.substr(0, 6)) {
				case '[html]':
					element.innerHTML = i18n(key.substr(6));
					break;
				case '[place':
					element.placeholder = i18n(key.substr(13));
					break;
				case '[title':
					element.title = i18n(key.substr(7));
					break;
				// no default
			}
		} else {
			element.textContent = i18n(key);
		}
	}
};

/**
 * @param {Object} elements
 * @param {boolean=} animate = false
 */
export function i18nToNodes(element) {
	setTimeout(() =>
		element.querySelectorAll('[data-i18n]').forEach(item => i18nToNode(item))
	, 1);
}

/**
 * @returns {void}
 */
export function initNotificationLanguage() {
	I18N_NOTIFICATION_MAP.forEach(item => I18N_NOTIFICATION_DATA[item[0]] = i18n(item[1]));
}

/**
 * @param {Function} startCallback
 * @param {Function=} langCallback = null
 */
export function initOnStartOrLangChange(startCallback, langCallback = null) {
	startCallback && startCallback();
	startCallback && trigger.subscribe(startCallback);
	langCallback && trigger.subscribe(langCallback);
}

/**
 * @param {number} code
 * @param {*=} message = ''
 * @param {*=} defCode = null
 * @returns {string}
 */
export function getNotification(code, message = '', defCode = null) {
	code = parseInt(code, 10) || 0;
	if (Notification.ClientViewError === code && message) {
		return message;
	}

	defCode = defCode ? parseInt(defCode, 10) || 0 : 0;
	return undefined === I18N_NOTIFICATION_DATA[code]
		? defCode && undefined === I18N_NOTIFICATION_DATA[defCode]
			? I18N_NOTIFICATION_DATA[defCode]
			: ''
		: I18N_NOTIFICATION_DATA[code];
}

/**
 * @param {object} response
 * @param {number} defCode = Notification.UnknownNotification
 * @returns {string}
 */
export function getNotificationFromResponse(response, defCode = Notification.UnknownNotification) {
	return response && response.ErrorCode
		? getNotification(parseInt(response.ErrorCode, 10) || defCode, response.ErrorMessage || '')
		: getNotification(defCode);
}

/**
 * @param {*} code
 * @returns {string}
 */
export function getUploadErrorDescByCode(code) {
	let result = '';
	switch (parseInt(code, 10) || 0) {
		case UploadErrorCode.FileIsTooBig:
			result = i18n('UPLOAD/ERROR_FILE_IS_TOO_BIG');
			break;
		case UploadErrorCode.FilePartiallyUploaded:
			result = i18n('UPLOAD/ERROR_FILE_PARTIALLY_UPLOADED');
			break;
		case UploadErrorCode.FileNoUploaded:
			result = i18n('UPLOAD/ERROR_NO_FILE_UPLOADED');
			break;
		case UploadErrorCode.MissingTempFolder:
			result = i18n('UPLOAD/ERROR_MISSING_TEMP_FOLDER');
			break;
		case UploadErrorCode.FileOnSaveingError:
			result = i18n('UPLOAD/ERROR_ON_SAVING_FILE');
			break;
		case UploadErrorCode.FileType:
			result = i18n('UPLOAD/ERROR_FILE_TYPE');
			break;
		default:
			result = i18n('UPLOAD/ERROR_UNKNOWN');
			break;
	}

	return result;
}

/**
 * @param {boolean} admin
 * @param {string} language
 */
export function reload(admin, language) {
	return new Promise((resolve, reject) => {
		const script = doc.createElement('script');
		script.onload = () => {
			// reload the data
			if (window.rainloopI18N) {
				I18N_DATA = window.rainloopI18N || {};
				i18nToNodes(doc);
				dispatchEvent(new CustomEvent('reload-time'));
				trigger(!trigger());
			}
			window.rainloopI18N = null;
			script.remove();
			resolve();
		};
		script.onerror = () => reject(new Error('Language '+language+' failed'));
		script.src = langLink(language, admin);
//		script.async = true;
		doc.head.append(script);
	});
}
