export const PRODUCT_TO_FIGI = {
	"BTC": "BTC",
	"ETH": "ETH",
	"LINK": "LINK",
	"DOT": "DOT",
	"LTC": "LTC",
	"AAVE": "AAVE",
	"UNI": "UNI",
	"ADA": "ADA",
	"SNX": "SNX",
	"MMM": "BBG000BP52R2",
	"ATVI": "BBG000CVWGS6",
	"AMD": "BBG000BBQCY0",
	"ABNB": "BBG001Y2XS07",
	"AMZN": "BBG000BVPV84",
	"AXP": "BBG000BCQZS4",
	"AAPL": "BBG000B9XRY4",
	"TSLA": "BBG000N9MNX3",
	"PFE": "BBG000BR2B91",
	"FB": "BBG000MM2P62",
	"NFLX": "BBG000CL9VN6",
	"GOOG": "BBG009S3NB30",
	"IBM": "BBG000BLNNH6",
	"INTC": "BBG000C0G1D1",
	"JNJ": "BBG000BMHYD1",
	"MSFT": "BBG000BPH459",
	"MSTR": "BBG000GQJPZ0",
	"NKE": "BBG000C5HS04",
	"PLTR": "BBG000N7QR55",
	"SQ": "BBG0018SLC07",
	"TSM": "BBG000BD8ZK0",
	"TWTR": "BBG000H6HNW3",
	"VZN": "BBG000HS77T5",
	"V": "BBG000PSKYX7",
	"WMT": "BBG000BWXBC2",
	"SP500": "BBG000H4FSM0",
	"COIN": "BBG00ZGF7771"
};

let FIGI_TO_PRODUCT = {};
for (const p in PRODUCT_TO_FIGI) {
	const figi = PRODUCT_TO_FIGI[p];
	FIGI_TO_PRODUCT[figi] = p;
}

export function figiToProduct(figi) {
	return FIGI_TO_PRODUCT[figi] || figi;
}

export function productToFigi(product) {
	return PRODUCT_TO_FIGI[product] || product;
}