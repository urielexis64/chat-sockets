const {Server} = require("net");

const HOST = "0.0.0.0";
const END = "END";

const connections = new Map();

const error = (err) => {
	console.error(err);
	process.exit(1);
};

const sendMessage = (message, origin) => {
	for (const socket of connections.keys()) {
		if (socket !== origin) {
			socket.write(message);
		}
	}
};

const listen = (port) => {
	const server = new Server();

	server.on("connection", (socket) => {
		const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
		console.log(`New connection from ${remoteSocket}`);
		socket.setEncoding("utf-8");

		socket.on("data", (message) => {
			if (!connections.has(socket)) {
				console.log(`Username ${message} set for connection ${remoteSocket}`);
				connections.set(socket, message);
			} else if (message === END) {
				console.log(`Connection with ${remoteSocket} closed`);
				connections.delete(socket);
				socket.end();
			} else {
				const fullMessage = `[${connections.get(socket)}]: ${message}`;
				console.log(`${remoteSocket} -> ${fullMessage}`);
				sendMessage(fullMessage, socket);
			}
		});
		socket.on("error", (err) => error(err.message));
	});

	server.listen({port, HOST}, () => console.log("Listening on port ", port));
	server.on("error", (err) => error(err.message));
};

const main = () => {
	if (process.argv.length !== 3) {
		error(`Usage: node ${__filename} {port}`);
	}
	let port = process.argv[2];
	if (isNaN(port)) {
		error(`Invalid port ${port}`);
	}

	port = Number(port);
	listen(port);
};

if (require.main === module) {
	main();
}
