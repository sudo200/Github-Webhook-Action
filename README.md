# Github Webhook Action

A simple HTTP server written in Javascript, which executes a program, \
when it receives a Github webhook payload.

## Usage
+ Install Nodejs, if you haven't.
+ Clone this repo.
+ Set the `SCRIPT` environment variable to the path of your program.
+ Start the server with `node src/index.js` (on Windoze: `node src\index.js`).

The server is now reachable under `<your-ip>:8080`

## Advanced features

**Changing the port:**  Define the environment variable `PORT` with your desired port. \
**Setting a secret:**   Define the environment variable `SECRET` with your secret.
