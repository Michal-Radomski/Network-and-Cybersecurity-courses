import dgram from "node:dgram";
import { AddressInfo } from "node:net";

const socket: dgram.Socket = dgram.createSocket("udp4");
// console.log("socket:", socket);

socket.bind(5000, "127.0.0.1");

socket.on("message", (msg, info): void => {
  console.log(`My Server got a datagram ${msg}, from: ${info.address}:${info.port}`);
});

socket.on("listening", (): void => {
  const address: AddressInfo = socket.address();
  console.log(`Server listening ${address.address}:${address.port}`);
});
