const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const url = req.url;
        
        if (url === '/' || url === '/start_sofi.html') {
            const filePath = path.join(__dirname, 'start_sofi.html');
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else if (url === '/index.html') {
            const indexPath = path.join(__dirname, 'index.html');
            fs.readFile(indexPath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else if (url === '/resource/icons/sofi.png') {
            const imagePath = path.join(__dirname, 'resource', 'icons', 'sofi.png');
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});