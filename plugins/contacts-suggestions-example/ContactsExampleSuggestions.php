<?php

class ContactsExampleSuggestions implements \RainLoop\Providers\Suggestions\ISuggestions
{
	/**
	 * @param \RainLoop\Model\Account $oAccount
	 * @param string $sQuery
	 * @param int $iLimit = 20
	 *
	 * @return array
	 */
	public function Process(RainLoop\Model\Account $oAccount, string $sQuery, int $iLimit = 20): array
	{
		$aResult = array(
			array($oAccount->Email(), ''),
			array('email@domain.com', 'name')
		);

		return $aResult;
	}
}
