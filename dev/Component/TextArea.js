import { componentExportHelper } from 'Component/Abstract';
import { AbstractInput } from 'Component/AbstractInput';

const DEFAULT_ROWS = 5;

class TextAreaComponent extends AbstractInput {
	/**
	 * @param {Object} params
	 */
	constructor(params) {
		super(params);

		this.rows = params.rows || DEFAULT_ROWS;
		this.spellcheck = !!params.spellcheck;
	}
}

export default componentExportHelper(TextAreaComponent, 'TextAreaComponent');
