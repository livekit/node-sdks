export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: 640 }}>
      <h1>LiveKit Webhooks Example</h1>
      <p>
        Webhook events sent by livekit-server are received at <code>/api/webhook</code> and logged
        to the server console.
      </p>
    </main>
  );
}
