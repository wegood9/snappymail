import ko from 'ko';

import { i18nToNodes } from 'Common/Translator';

class AbstractComponent {
	disposable = [];

	dispose() {
		this.disposable.forEach((funcToDispose) => {
			if (funcToDispose && funcToDispose.dispose) {
				funcToDispose.dispose();
			}
		});
	}
}

/**
 * @param {*} ClassObject
 * @param {string} templateID = ''
 * @returns {Object}
 */
const componentExportHelper = (ClassObject, templateID = '') => ({
	template: templateID ? { element: templateID } : '<b></b>',
	viewModel: {
		createViewModel: (params, componentInfo) => {
			params = params || {};
			params.element = null;

			if (componentInfo && componentInfo.element) {
				params.component = componentInfo;
				params.element = componentInfo.element;

				i18nToNodes(componentInfo.element);

				if (undefined !== params.inline && ko.unwrap(params.inline)) {
					params.element.style.display = 'inline-block';
				}
			}

			return new ClassObject(params);
		}
	}
});

export { AbstractComponent, componentExportHelper };
