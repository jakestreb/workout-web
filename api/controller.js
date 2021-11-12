import * as request from './request';

export function addUser(name, gender, experience, primaryFocus) {
	return request.post('/user', {}, { name, gender, experience, primaryFocus });
}

export function startGenerator(name, intensity, timeMinutes) {
	return request.post('/start', {}, { name, intensity, timeMinutes });
}

export function stopGenerator() {
	return request.post('/stop', {}, {});
}

export function generateNext(index) {
	return request.get('/next', { index });
}

export function getProgress() {
	return request.get('/progress');
}
