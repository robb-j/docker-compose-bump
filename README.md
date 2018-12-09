# docker-compose bump

Get or bump the version of a service in a docker-compose file.
It also edits your `docker-compose.yml` inline to preserve comments & spacing.

## Usage

**command**

```bash
npx dc-bump tinypoll 0.2.1
```

**changes:**

```yml
services:
  tinypoll:
    image: robbj/tinypoll:0.1.0 # before
    image: robbj/tinypoll:0.2.1 # after
    environment:
      SITE_NAME: Tadpoll
```

It'll commit the change with the message

> :cloud: Upgraded tinypoll to 0.2.1

### More commands

```bash
# Get the version of a service
npx dc-bump tinypoll

# Output full usage
npx dc-bump --help
```

## Development

This project is written in Typescript and uses Prettier to format code on git stage.

```bash
# Compile typescript to dist/
npm run build

# Run prettier
npm run prettier

# Run unit tests
npm run test

# Run test coverage
npm run coverage
```
