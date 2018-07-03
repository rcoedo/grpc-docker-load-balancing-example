if (process.argv.length < 3 || typeof process.argv[2] !== "string") {
  console.log("Feed me a proto file!");
  process.exit(1);
}

const repl = require("repl");
const grpc = require("grpc");
const { promisify } = require("util");

const proto = process.argv[2];
const phonebook = grpc.load(proto).phonebook;
const connect = uri => {
  const client = new phonebook.Phonebook(uri, grpc.credentials.createInsecure(), {
    "grpc.lb_policy_name": "round_robin",
  });

  return {
    search: promisify(client.search).bind(client),
  };
};

const api = [
  ["phonebook", phonebook, "the result of loading the proto file"],
  ["connect", connect, "a uri => client function."],
];

console.log("Hello! I am the grpc client");
console.log("You can find the API under the `api` variable (who would have guessed?)");
console.log("\n");
console.log("It contains something like this:\n");
console.log(api.reduce((acc, [name, _, desc]) => ({ ...acc, [name]: desc }), {}));
console.log("\n");
console.log(
  "You also have a couple of grpc services available, `phonebook-server-1:3000` and `phonebook-server-2:3000`.",
);
console.log("The `phonebook-server:3000` resolves to both IPs.");
console.log("\n");
replServer = repl.start({
  prompt: "grpc-client > ",
});

replServer.context.api = api.reduce((acc, [name, fn]) => ({ ...acc, [name]: fn }), {});
