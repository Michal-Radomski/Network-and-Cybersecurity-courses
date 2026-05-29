import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// Load the protobuf file
const PROTO_PATH = path.join(__dirname, "schema.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Get the user package object from the loaded definition
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const usersPackage = protoDescriptor.users;

// Mock database for illustration
const mockUsers = [
  { id: 1, name: "Alice Smith", email: "alice@example.com" },
  { id: 2, name: "Bob Jones", email: "bob@example.com" },
];

/**
 * Implements the GetUser RPC method.
 */
function getUser(call: any, callback: any): void {
  const userId = call.request.id;
  console.log(`Server received request for User ID: ${userId}`);

  const user = mockUsers.find((u) => u.id === userId);

  if (user) {
    // First parameter is error (null if successful), second is the response object
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: `User with ID ${userId} not found`,
    });
  }
}

// Start the gRPC Server
function main(): void {
  const server = new grpc.Server();

  // Map the proto service definition to our TypeScript implementation
  server.addService(usersPackage.UserService.service, { GetUser: getUser });

  const address = "127.0.0.1:50051";

  // Bind server to port and start it up
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
    console.log("port:", port);
    if (err) {
      console.error("Failed to start server:", err);
      return;
    }
    console.log(`gRPC Server running securely/insecurely at http://${address}`);
  });
}

main();
