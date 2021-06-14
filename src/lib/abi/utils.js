export function isDynamicSizeType(type) {
	return ['string', 'bytes'].includes(type) || type.includes('[]');
}