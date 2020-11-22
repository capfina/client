
const errors = {
	'BAD_LEV_OR_SYMBOL': 'Leverage or product is invalid.',
	'INVALID_AMOUNT': 'Amount is invalid.',
	'INVALID_CURRENCY': 'Currency is not supported.',
	'!margin': 'The minimum margin amount is 10 DAI.',
	'!leverage': 'Leverage is invalid.',
	'!balance': 'Insufficient funds.',
	'INVALID_USER': 'User is invalid.',
	'POSITION_NOT_FOUND': "The position you're trying to query is no longer available.",
	'ALREADY_LIQUIDATING': "This position is already being liquidated."
}

export function showReadableError(e) {
	console.error(e);
	if (!e || typeof(e) != 'string') return "Unexpected error. Please try again later.";
	for (const err in errors) {
		if (e.includes(err)) return errors[err];
	}
	return e;
}