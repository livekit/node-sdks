const lksdk = require('livekit-server-sdk');

const http = require('http');
const host = 'localhost';
const port = 3000;

const receiver = new lksdk.WebhookReceiver(
  process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET
)

const webhookHandler = (req, res) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    const event = receiver.receive(data, req.headers.authorization);

    console.log('received webhook event', event);

    res.writeHead(200);
    res.end();
  });
}

const server = http.createServer(webhookHandler);
server.listen(port, host, () => {
  console.log(`Webhook example running on http://${host}:${port}`);
});
