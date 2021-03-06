import ko from 'ko';

import { KeyState, StorageResultType, Notification } from 'Common/Enums';
import { getNotification, i18n } from 'Common/Translator';

import Remote from 'Remote/Admin/Fetch';

import { popup, command, isPopupVisible, showScreenPopup } from 'Knoin/Knoin';
import { AbstractViewNext } from 'Knoin/AbstractViewNext';

@popup({
	name: 'View/Popup/Plugin',
	templateID: 'PopupsPlugin'
})
class PluginPopupView extends AbstractViewNext {
	constructor() {
		super();

		this.onPluginSettingsUpdateResponse = this.onPluginSettingsUpdateResponse.bind(this);

		this.addObservables({
			saveError: '',
			name: '',
			readme: ''
		});

		this.configures = ko.observableArray([]);

		this.hasReadme = ko.computed(() => !!this.readme());
		this.hasConfiguration = ko.computed(() => 0 < this.configures().length);

		this.bDisabeCloseOnEsc = true;
		this.sDefaultKeyScope = KeyState.All;

		this.tryToClosePopup = this.tryToClosePopup.debounce(200);
	}

	@command((self) => self.hasConfiguration())
	saveCommand() {
		const list = {};
		list.Name = this.name();

		this.configures().forEach(oItem => {
			let value = oItem.value();
			if (false === value || true === value) {
				value = value ? '1' : '0';
			}
			list['_' + oItem.Name] = value;
		});

		this.saveError('');
		Remote.pluginSettingsUpdate(this.onPluginSettingsUpdateResponse, list);
	}

	onPluginSettingsUpdateResponse(result, data) {
		if (StorageResultType.Success === result && data && data.Result) {
			this.cancelCommand();
		} else {
			this.saveError('');
			if (data && data.ErrorCode) {
				this.saveError(getNotification(data.ErrorCode));
			} else {
				this.saveError(getNotification(Notification.CantSavePluginSettings));
			}
		}
	}

	onShow(oPlugin) {
		this.name('');
		this.readme('');
		this.configures([]);

		if (oPlugin) {
			this.name(oPlugin.Name);
			this.readme(oPlugin.Readme);

			const config = oPlugin.Config;
			if (Array.isNotEmpty(config)) {
				this.configures(
					config.map(item => ({
						'value': ko.observable(item[0]),
						'placeholder': ko.observable(item[6]),
						'Name': item[1],
						'Type': item[2],
						'Label': item[3],
						'Default': item[4],
						'Desc': item[5]
					}))
				);
			}
		}
	}

	tryToClosePopup() {
		const PopupsAskViewModel = require('View/Popup/Ask');
		if (!isPopupVisible(PopupsAskViewModel)) {
			showScreenPopup(PopupsAskViewModel, [
				i18n('POPUPS_ASK/DESC_WANT_CLOSE_THIS_WINDOW'),
				() => this.modalVisibility() && this.cancelCommand && this.cancelCommand()
			]);
		}
	}

	onBuild() {
		shortcuts.add('escape', '', KeyState.All, () => {
			if (this.modalVisibility()) {
				this.tryToClosePopup();
			}

			return false;
		});
	}
}

export { PluginPopupView, PluginPopupView as default };
