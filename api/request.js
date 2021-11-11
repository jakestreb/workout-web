import axios from 'axios';

const baseUrl = `${process.env.serverUrl}:${process.env.serverPort}`;

export async function get(path, queryParams) {
	try {
		const { data } = await axios.get(path, {
			params: queryParams,
			baseURL: baseUrl,
			paramsSerializer: params => qs.stringify(params),
			timeout: process.env.httpTimeout
		});
		return data;
	} catch (err) {
		console.warn(`Error GET ${path}`, err);
	}
}

export async function post(path, queryParams, body) {
	try {
		console.warn('calling post', baseUrl, path, body, queryParams);
		const { data } = await axios.post(path, body, {
			params: queryParams,
			baseURL: baseUrl,
			timeout: process.env.httpTimeout
		});
		console.warn('data', data);
		return data;
	} catch (err) {
		console.warn(`Error POST ${path}`, err);
	}
}
