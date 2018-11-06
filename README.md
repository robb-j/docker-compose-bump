# docker-compose bump

Get or bump the version of a service in a docker-compose file

## Usage

**command**

```bash
npx dc-bump tinypoll 0.2.1
```

**before:**

```yml
services:
  nginx:
    image: nginx:1-alpine
    ports:
      - 80:80
  tinypoll:
    image: robbj/tinypoll:0.1.0
    environment:
      SITE_NAME: Tadpoll
```

**after:**

```yml
services:
  nginx:
    image: nginx:1-alpine
    ports:
      - 80:80
  tinypoll:
    image: robbj/tinypoll:0.2.1
    environment:
      SITE_NAME: Tadpoll
```

It'll commit the change with the message

> :cloud: Upgraded tinypoll to 0.2.1

For more usage run:

```bash
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
