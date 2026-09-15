<!--
SPDX-FileCopyrightText: 2024 LiveKit, Inc.

SPDX-License-Identifier: Apache-2.0
-->

<!--BEGIN_BANNER_IMAGE-->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/banner_dark.png">
  <source media="(prefers-color-scheme: light)" srcset="/.github/banner_light.png">
  <img style="width:100%;" alt="The LiveKit icon, the name of the repository and some sample code in the background." src="https://raw.githubusercontent.com/livekit/node-sdks/main/.github/banner_light.png">
</picture>

<!--END_BANNER_IMAGE-->

<h1>
  LiveKit Node SDKs
</h1>

<!--BEGIN_DESCRIPTION-->
Use this SDK to add realtime video, audio and data features to your Node app. By connecting to <a href="https://livekit.io/">LiveKit</a> Cloud or a self-hosted server, you can quickly build applications such as multi-modal AI, live streaming, or video calls with just a few lines of code.
<!--END_DESCRIPTION-->

<!--BEGIN_AGENTS_INFO-->
> [!IMPORTANT]
> If you're building Voice AI, [LiveKit Agents](https://github.com/livekit/agents) is the SDK for code-first realtime voice agents. STT, LLM, TTS, turn detection, [expressive speech](https://docs.livekit.io/agents/models/tts/expressive/), [keyterm accuracy](https://docs.livekit.io/agents/models/stt/keyterms/), tool usage, and telephony all come bundled in the framework. It's available in both [Python](https://github.com/livekit/agents) and [Node.js](https://github.com/livekit/agents-js).
>
> ```python
> # agent.py
> from livekit import agents
> from livekit.agents import Agent, AgentServer, AgentSession, STTContextOptions, TurnHandlingOptions, inference
>
> server = AgentServer()
>
>
> @server.rtc_session(agent_name="my-agent")
> async def my_agent(ctx: agents.JobContext):
>     session = AgentSession(
>         stt=inference.STT(model="deepgram/nova-3", language="multi"),
>         llm=inference.LLM(model="google/gemma-4-31b-it"),
>         tts=inference.TTS(model="inworld/inworld-tts-2", voice="Ashley"),
>         turn_handling=TurnHandlingOptions(turn_detection=inference.TurnDetector()),
>         stt_context_options=STTContextOptions(keyterms=["LiveKit", "Acme Corp"]),
>         expressive=True,
>     )
>     await session.start(room=ctx.room, agent=Agent(instructions="You are a helpful voice AI assistant."))
>     await session.generate_reply(instructions="Greet the user and offer your assistance.")
>
>
> if __name__ == "__main__":
>     agents.cli.run_app(server)
> ```
>
> Models come from [LiveKit Inference](https://docs.livekit.io/agents/models/) with no per-provider API keys, and LiveKit Cloud handles [deployment](https://docs.livekit.io/deploy/agents/) and [observability](https://docs.livekit.io/deploy/observability/). Visit the docs for more info at [docs.livekit.io/agents](https://docs.livekit.io/agents/).
>
> Using a coding agent? Install the LiveKit skill with `npx skills add livekit/agent-skills` and add the docs MCP at `https://docs.livekit.io/mcp/` (see [coding agent support](https://docs.livekit.io/intro/coding-agents/)).
<!--END_AGENTS_INFO-->

## Monorepo Navigation

- **Packages**:
  - [Server SDK](/packages/livekit-server-sdk) - to interact with server APIs.
  - [Node realtime SDK](/packages/livekit-rtc) - to connect to LiveKit as a server-side participant, and to publish and subscribe to audio, video, and data.
- **Examples**
  - [Webhooks HTTP (server SDK)](/examples/webhooks-http/README.md)
  - [Webhooks NextJS (server SDK)](/examples/webhooks-nextjs/README.md)
  - [Publishing to a room (realtime SDK)](/examples/publish-wav/)

<br/>
<br/>

## Development Setup

If you are interested in contributing to the project or running the examples that are part of this mono-repository, then you must first set up your development environment.

### Setup Monorepo

This repo consists of multiple packages that partly build on top of each other.
It relies on pnpm workspaces and [Turborepo](https://turbo.build/repo/docs) (which gets installed automatically).

Clone the repo and run `pnpm install` the root level:

```shell
pnpm install
```

In order to link up initial dependencies and check whether everything has installed correctly run

```shell
pnpm build
```

This will build all the packages in `/packages` and the examples in `/examples` once.

After that you can use a more granular command to only rebuild the packages you are working on.

### Setup Submodules

Run the following command to install the submodules.

```shell
git submodule update --init --recursive
```

Then run `pnpm build` to make sure everything is up to date.

<!--BEGIN_REPO_NAV-->
<br/><table>
<thead><tr><th colspan="2">LiveKit Ecosystem</th></tr></thead>
<tbody>
<tr><td>Agents SDKs</td><td><a href="https://github.com/livekit/agents">Python</a> · <a href="https://github.com/livekit/agents-js">Node.js</a></td></tr><tr></tr>
<tr><td>LiveKit SDKs</td><td><a href="https://github.com/livekit/client-sdk-js">Browser</a> · <a href="https://github.com/livekit/client-sdk-swift">Swift</a> · <a href="https://github.com/livekit/client-sdk-android">Android</a> · <a href="https://github.com/livekit/client-sdk-flutter">Flutter</a> · <a href="https://github.com/livekit/client-sdk-react-native">React Native</a> · <a href="https://github.com/livekit/rust-sdks">Rust</a> · <b>Node.js</b> · <a href="https://github.com/livekit/python-sdks">Python</a> · <a href="https://github.com/livekit/client-sdk-unity">Unity</a> · <a href="https://github.com/livekit/client-sdk-unity-web">Unity (WebGL)</a> · <a href="https://github.com/livekit/client-sdk-esp32">ESP32</a> · <a href="https://github.com/livekit/client-sdk-cpp">C++</a></td></tr><tr></tr>
<tr><td>Starter Apps</td><td><a href="https://github.com/livekit-examples/agent-starter-python">Python Agent</a> · <a href="https://github.com/livekit-examples/agent-starter-node">TypeScript Agent</a> · <a href="https://github.com/livekit-examples/agent-starter-react">React App</a> · <a href="https://github.com/livekit-examples/agent-starter-swift">SwiftUI App</a> · <a href="https://github.com/livekit-examples/agent-starter-android">Android App</a> · <a href="https://github.com/livekit-examples/agent-starter-flutter">Flutter App</a> · <a href="https://github.com/livekit-examples/agent-starter-react-native">React Native App</a> · <a href="https://github.com/livekit-examples/agent-starter-embed">Web Embed</a></td></tr><tr></tr>
<tr><td>UI Components</td><td><a href="https://github.com/livekit/components-js">React</a> · <a href="https://github.com/livekit/components-android">Android Compose</a> · <a href="https://github.com/livekit/components-swift">SwiftUI</a> · <a href="https://github.com/livekit/components-flutter">Flutter</a></td></tr><tr></tr>
<tr><td>Server APIs</td><td><b>Node.js</b> · <a href="https://github.com/livekit/server-sdk-go">Golang</a> · <a href="https://github.com/livekit/server-sdk-ruby">Ruby</a> · <a href="https://github.com/livekit/server-sdk-kotlin">Java/Kotlin</a> · <a href="https://github.com/livekit/python-sdks">Python</a> · <a href="https://github.com/livekit/rust-sdks">Rust</a> · <a href="https://github.com/agence104/livekit-server-sdk-php">PHP (community)</a> · <a href="https://github.com/pabloFuente/livekit-server-sdk-dotnet">.NET (community)</a></td></tr><tr></tr>
<tr><td>Resources</td><td><a href="https://docs.livekit.io">Docs</a> · <a href="https://docs.livekit.io/mcp">Docs MCP Server</a> · <a href="https://github.com/livekit/livekit-cli">CLI</a> · <a href="https://cloud.livekit.io">LiveKit Cloud</a></td></tr><tr></tr>
<tr><td>LiveKit Server OSS</td><td><a href="https://github.com/livekit/livekit">LiveKit server</a> · <a href="https://github.com/livekit/egress">Egress</a> · <a href="https://github.com/livekit/ingress">Ingress</a> · <a href="https://github.com/livekit/sip">SIP</a></td></tr><tr></tr>
<tr><td>Community</td><td><a href="https://community.livekit.io">Developer Community</a> · <a href="https://livekit.io/join-slack">Slack</a> · <a href="https://x.com/livekit">X</a> · <a href="https://www.youtube.com/@livekit_io">YouTube</a></td></tr>
</tbody>
</table>
<!--END_REPO_NAV-->
