import os
from livekit import api, rtc
from aiohttp import web


livekit_url = os.environ["LIVEKIT_URL"]
livekit_api_key = os.environ["LIVEKIT_API_KEY"]
livekit_api_secret = os.environ["LIVEKIT_API_SECRET"]

token_verifier = api.TokenVerifier(livekit_api_key, livekit_api_secret)
webhook_receiver = api.WebhookReceiver(token_verifier)


async def connect_to_livekit_room(room_name: str):
    """Connect to a LiveKit room, similar to the Node.js version"""
    try:
        # Create access token
        access_token = api.AccessToken(livekit_api_key, livekit_api_secret)
        access_token.with_identity("phonic-sts-websocket")
        access_token.with_grants(
            api.VideoGrants(
                room=room_name,
                room_join=True,
                room_create=True,
                can_publish=True,
            )
        )

        jwt = access_token.to_jwt()
        print(f"Created JWT for room {room_name} \n\n")

        room = rtc.Room()
        print(f"Created Livekit room {room_name} \n\n")

        await room.connect(livekit_url, jwt)
        print(f"Connected to room {room_name} \n\n")

        return {"data": room, "error": None}
    except Exception as e:
        return {"data": None, "error": str(e)}


async def handle_webhook(request):
    auth_token = request.headers.get("Authorization")
    if not auth_token:
        return web.Response(status=401)

    body = await request.read()
    event = webhook_receiver.receive(body.decode("utf-8"), auth_token)
    print(f"Received event: {event.event}")

    if (
        event.event != "room_started"
        or not event.room
        or not event.room.name.startswith("call")
    ):
        # Not the event that we're interested. Just return success is true.
        print("Not the event that we're interested. Just return success is true. \n\n")
        return web.json_response({"success": True})

    room_name = event.room.name
    room_result = await connect_to_livekit_room(room_name)

    if room_result["error"] is not None:
        print(f"Failed to connect to room {room_name}: {room_result['error']} \n\n")
        return web.json_response(room_result["error"], status=500)

    return web.Response(text="Received event ", status=200)


if __name__ == "__main__":
    app = web.Application()
    app.router.add_post("/v1/conversations/inbound_call", handle_webhook)
    print("Listening on http://localhost:3000")
    web.run_app(app, port=3000)
