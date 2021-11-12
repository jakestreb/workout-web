import axios from 'axios';
import * as qs from 'qs';

const baseUrl = process.env.SERVER_HOST;

export async function get(path, queryParams) {
	try {
		const { data } = await axios.get(path, {
			params: queryParams,
			baseURL: baseUrl,
			paramsSerializer: params => qs.stringify(params),
			timeout: process.env.API_TIMEOUT
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
			baseURL: baseUrl,
			timeout: process.env.API_TIMEOUT
		});
		return data;
	} catch (err) {
		console.warn(`Error POST ${path}`, err);
	}
}
