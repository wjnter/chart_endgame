const TOKEN_KEY = "jwt";

export const CONSTANT_TYPE = ["gas", "temperature", "battery"];
export const CONSTANT_TYPE_AVG = ["avggas", "avgtemperature"];

// Authe

export const setToken = (value, tokenKey = TOKEN_KEY) => {
	if (localStorage) {
		localStorage.setItem(tokenKey, JSON.stringify(value));
	}
};

export const getToken = (tokenKey = TOKEN_KEY) => {
	if (localStorage && localStorage.getItem(tokenKey)) {
		return JSON.parse(localStorage.getItem(tokenKey));
	}
	return null;
};

export const clearToken = (tokenKey = TOKEN_KEY) => {
	if (localStorage) {
		localStorage.removeItem(tokenKey);
	}
};

export const logs = (variable) => {
	console.log(`:::: ${variable} ::::`, variable);
};
