import axios from 'axios';
import * as qs from 'qs';

export async function get(path, queryParams) {
	try {
		const { data } = await axios.get(path, {
			params: queryParams,
			baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
			paramsSerializer: params => qs.stringify(params),
			timeout: process.env.NEXT_PUBLIC_API_TIMEOUT
		});
		return data;
	} catch (err) {
		console.warn(`Error GET ${path}`, err);
	}
}

export async function post(path, queryParams, body) {
	try {
		const { data } = await axios.post(path, body, {
			params: queryParams,
			baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
			timeout: process.env.NEXT_PUBLIC_API_TIMEOUT
		});
		return data;
	} catch (err) {
		console.warn(`Error POST ${path}`, err);
	}
}
