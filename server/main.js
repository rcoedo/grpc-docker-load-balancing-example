if (process.argv.length < 3 || typeof process.argv[2] !== "string") {
  console.log("Feed me a proto file!");
  process.exit(1);
}

const grpc = require("grpc");

const proto = process.argv[2];
const phonebook = grpc.load(proto).phonebook;

const buildServer = () => {
  const persons = require("./persons");

  const server = new grpc.Server();
  server.addService(phonebook.Phonebook.service, {
    search: (call, callback) => {
      console.log("Request received:", call.request);
      callback(null, { entry: persons[call.request.person] });
    },
  });
  return server;
};

const port = process.env.PORT || 3000;
const server = buildServer();
server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
console.log(`Starting server on 0.0.0.0:${port}`);
server.start();
