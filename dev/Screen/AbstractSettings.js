import ko from 'ko';

import { VIEW_MODELS } from 'Common/Globals';
import { pString } from 'Common/Utils';
import { settings } from 'Common/Links';

import { AbstractScreen } from 'Knoin/AbstractScreen';

class AbstractSettingsScreen extends AbstractScreen {
	/**
	 * @param {Array} viewModels
	 */
	constructor(viewModels) {
		super('settings', viewModels);

		this.menu = ko.observableArray([]);

		this.oCurrentSubScreen = null;

		this.setupSettings();
	}

	/**
	 * @param {Function=} fCallback
	 */
	setupSettings(fCallback = null) {
		if (fCallback) {
			fCallback();
		}
	}

	onRoute(subName) {
		let settingsScreen = null,
			RoutedSettingsViewModel = null,
			viewModelDom = null;

		RoutedSettingsViewModel = VIEW_MODELS.settings.find(
			SettingsViewModel =>
				SettingsViewModel && SettingsViewModel.__rlSettingsData && subName === SettingsViewModel.__rlSettingsData.Route
		);

		if (RoutedSettingsViewModel) {
			if (
				VIEW_MODELS['settings-removed'].find(
					DisabledSettingsViewModel =>
						DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel
				)
			) {
				RoutedSettingsViewModel = null;
			}

			if (
				RoutedSettingsViewModel &&
				VIEW_MODELS['settings-disabled'].find(
					DisabledSettingsViewModel =>
						DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel
				)
			) {
				RoutedSettingsViewModel = null;
			}
		}

		if (RoutedSettingsViewModel) {
			if (RoutedSettingsViewModel.__builded && RoutedSettingsViewModel.__vm) {
				settingsScreen = RoutedSettingsViewModel.__vm;
			} else {
				const vmPlace = document.getElementById('rl-settings-subscreen');
				if (vmPlace) {
					settingsScreen = new RoutedSettingsViewModel();

					viewModelDom = Element.fromHTML('<div class="rl-settings-view-model" hidden=""></div>');
					vmPlace.append(viewModelDom);

					settingsScreen.viewModelDom = viewModelDom;

					settingsScreen.__rlSettingsData = RoutedSettingsViewModel.__rlSettingsData;

					RoutedSettingsViewModel.__dom = viewModelDom;
					RoutedSettingsViewModel.__builded = true;
					RoutedSettingsViewModel.__vm = settingsScreen;

					const tmpl = { name: RoutedSettingsViewModel.__rlSettingsData.Template };
					ko.applyBindingAccessorsToNode(
						viewModelDom,
						{
							i18nInit: true,
							template: () => tmpl
						},
						settingsScreen
					);

					settingsScreen.onBuild && settingsScreen.onBuild(viewModelDom);
				} else {
					console.log('Cannot find sub settings view model position: SettingsSubScreen');
				}
			}

			if (settingsScreen) {
				const o = this;
				setTimeout(() => {
					// hide
					if (o.oCurrentSubScreen) {
						o.oCurrentSubScreen.onHide && o.oCurrentSubScreen.onHide();
						o.oCurrentSubScreen.viewModelDom.hidden = true;
					}
					// --

					o.oCurrentSubScreen = settingsScreen;

					// show
					if (o.oCurrentSubScreen) {
						o.oCurrentSubScreen.onBeforeShow && o.oCurrentSubScreen.onBeforeShow();
						o.oCurrentSubScreen.viewModelDom.hidden = false;
						o.oCurrentSubScreen.onShow && o.oCurrentSubScreen.onShow();

						o.menu().forEach(item => {
							item.selected(
								settingsScreen &&
									settingsScreen.__rlSettingsData &&
									item.route === settingsScreen.__rlSettingsData.Route
							);
						});

						document.querySelector('#rl-content .b-settings .b-content').scrollTop = 0;
					}
					// --
				}, 1);
			}
		} else {
			rl.route.setHash(settings(), false, true);
		}
	}

	onHide() {
		if (this.oCurrentSubScreen && this.oCurrentSubScreen.viewModelDom) {
			this.oCurrentSubScreen.onHide && this.oCurrentSubScreen.onHide();
			this.oCurrentSubScreen.viewModelDom.hidden = true;
		}
	}

	onBuild() {
		VIEW_MODELS.settings.forEach(SettingsViewModel => {
			if (
				SettingsViewModel &&
				SettingsViewModel.__rlSettingsData &&
				!VIEW_MODELS['settings-removed'].find(
					RemoveSettingsViewModel => RemoveSettingsViewModel && RemoveSettingsViewModel === SettingsViewModel
				)
			) {
				this.menu.push({
					route: SettingsViewModel.__rlSettingsData.Route,
					label: SettingsViewModel.__rlSettingsData.Label,
					selected: ko.observable(false),
					disabled: !!VIEW_MODELS['settings-disabled'].find(
						DisabledSettingsViewModel => DisabledSettingsViewModel && DisabledSettingsViewModel === SettingsViewModel
					)
				});
			}
		});
	}

	routes() {
		const DefaultViewModel = VIEW_MODELS.settings.find(
				SettingsViewModel =>
					SettingsViewModel && SettingsViewModel.__rlSettingsData && SettingsViewModel.__rlSettingsData.IsDefault
			),
			defaultRoute =
				DefaultViewModel && DefaultViewModel.__rlSettingsData ? DefaultViewModel.__rlSettingsData.Route : 'general',
			rules = {
				subname: /^(.*)$/,
				normalize_: (rquest, vals) => {
					vals.subname = undefined === vals.subname ? defaultRoute : pString(vals.subname);
					return [vals.subname];
				}
			};

		return [
			['{subname}/', rules],
			['{subname}', rules],
			['', rules]
		];
	}
}

export { AbstractSettingsScreen, AbstractSettingsScreen as default };
