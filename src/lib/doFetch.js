export default async function doFetch(url, opt) {
	const r = await fetch(url, opt);
	const data = await r.json();
	if (r.ok && data) {
		return data;
	} else {
		console.error(data && data.message);
		throw new Error(data && data.message || 'Unknown error occurred, please try again later.');
	}
}