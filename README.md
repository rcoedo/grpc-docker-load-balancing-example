# Grpc load balancing example

## Running the servers
`docker-compose -f config/docker-compose.server.yml up`

## Running the client
`docker-compose -f config/docker-compose.client.yml run --rm phonebook-client`
