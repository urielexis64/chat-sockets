const {Socket} = require("net");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

const socket = new Socket();
socket.setEncoding("utf-8");

socket.connect({
	host: "localhost",
	port: 8000,
});

readline.on("line", (line) => {
	socket.write(line);
});

socket.on("data", console.log);
