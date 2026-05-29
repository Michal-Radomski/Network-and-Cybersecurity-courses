import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// Load the protobuf file identical to how the server did
const PROTO_PATH = path.join(__dirname, "schema.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const UserService = protoDescriptor.users.UserService;

function main(): void {
  const targetAddress = "127.0.0.1:50051";

  // Instantiate the auto-generated client stub
  const client = new UserService(targetAddress, grpc.credentials.createInsecure());

  // Formulate our payload matching the UserRequest message structure
  const requestPayload = { id: 1 };

  console.log(`Client invoking GetUser RPC...`);

  // Directly invoke the remote method!
  client.GetUser(requestPayload, (error: any, response: any) => {
    if (error) {
      console.error("RPC Error:", error.details);
      return;
    }

    // The response object natively mirrors the UserResponse proto structure
    console.log("Successfully received RPC response from server:");
    console.log(`ID: ${response.id}`);
    console.log(`Name: ${response.name}`);
    console.log(`Email: ${response.email}`);
  });
}

main();
