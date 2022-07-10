import { Server } from 'http';
import crypto from 'crypto';
import { spawn } from 'child_process';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
if(process.env.SCRIPT === undefined)
    throw new Error("Please specify a script to run, by defining an Environment variable called SCRIPT");
const SECRET = process.env.SECRET;

let lock = false;

const server = new Server(async (req, res) => {
    if(req.method !== "POST") {
        res.writeHead(405, { ContentType: "text/plain" });
        res.end("405 Method not allowed", 'utf-8');
        return;
    }

    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    if(
        SECRET &&
        req.headers['x-hub-signature-256'] !== "sha256=" + crypto
            .createHmac('sha256', SECRET)
            .update(data).digest('hex')
    ) {
        res.writeHead(401, { ContentType: "text/plain" });
        res.end("401 Unauthorized", 'utf-8');
        return;
    }

    if(lock) {
        res.writeHead(400, { ContentType: "text/plain" });
        res.end("400 Bad Request", 'utf-8');
        return;
    }

    spawn(process.env.SCRIPT).on('close', code => lock = false);
    lock = true;

    res.writeHead(204);
    res.end();
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));
