const api = async (method, body = {}, signal) => {
	let headers = {
		"X-Master-Key": "$2b$10$ou1eG5cCVElqaTRE0N33zeHeGocpZk0H0e0.5jO4GeIVd2vaN.5zq",
		"X-Access-Key": "$2b$10$Yet/6G1q6JkV8tA48ACv/OF/eXoS9XpX8uCCK1/38M3MjqcviVUz.",
	};

	if (method === "PUT") {
		headers["Content-Type"] = "application/json";
	}

	let options = {
		method: method,
		headers: headers,
	};

	if (signal !== undefined) {
		options["signal"] = signal;
	}

	if (method === "PUT") {
		options["body"] = JSON.stringify(body);
	}

	const response = await fetch(
		`https://api.jsonbin.io/v3/b/64fe534a8d92e126ae6a12f7${method === "GET" ? "/latest" : ""}`,
		options
	);
	return await response.json();
};

export default api;
