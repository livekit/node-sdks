import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';
import { AccessToken, AgentDispatchClient } from 'livekit-server-sdk';

const roomName = 'my-room';
const agentName = 'test-agent';

/**
 * This example demonstrates how to have an agent join a room without using
 * the automatic dispatch.
 * In order to use this feature, you must have an agent running with `agentName` set
 * when defining your WorkerOptions.
 *
 * A dispatch requests the agent to enter a specific room with optional metadata.
 */
async function createExplicitDispatch() {
  const agentDispatchClient = new AgentDispatchClient(process.env.LIVEKIT_URL);

  // this will create invoke an agent with agentName: test-agent to join `my-room`
  const dispatch = await agentDispatchClient.createDispatch(roomName, agentName, {
    metadata: '{"mydata": "myvalue"}',
  });
  console.log('created dispatch', dispatch);

  const dispatches = await agentDispatchClient.listDispatch(roomName);
  console.log(`there are ${dispatches.length} dispatches in ${roomName}`);
}

/**
 * When agent name is set, the agent will no longer be automatically dispatched
 * to new rooms. If you want that agent to be dispatched to a new room as soon as
 * the participant connects, you can set the roomConfig with the agent
 * definition in the access token.
 */
async function createTokenWithAgentDispatch(): Promise<string> {
  const at = new AccessToken();
  at.identity = 'my-participant';
  at.addGrant({ roomJoin: true, room: roomName });
  at.attributes = {
    mykey: 'myvalue',
  };
  at.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName: agentName,
        metadata: '{"mydata": "myvalue"}',
      }),
    ],
  });
  return await at.toJwt();
}

createTokenWithAgentDispatch().then((token) => {
  console.log('created participant token', token);
});

console.log('creating explicit dispatch');
createExplicitDispatch();
