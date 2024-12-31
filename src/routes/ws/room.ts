import { autoRoute, type ServerWebSocket } from 'ws-routers/bun';
import { server } from '@server';
import { createBoard, boards, type Board, mark } from '@/utils/game';
import { createMove, draw, startAsO, startAsSpectator, startAsX, winMessages } from '@/utils/message';

type Data = [
  // Topic
  topic: string,
  // Player turn
  turn: 0 | 1 | 2,
  // Board reference (spectators don't have this field)
  board: Board | null,
  // Target spectator topic
  spectatorTopic: string
];

export default autoRoute<Data>({
  open: (ws) => {
    ws.binaryType = 'uint8array';

    let topic = ws.data[0];
    ws.data[3] = '$' + topic;

    switch (server.subscriberCount(topic)) {
      // Initialize the board
      case 0:
        ws.data[1] = 0;
        ws.data[2] = createBoard(topic);
        break;

      // Start sending message to the players
      case 1: {
        ws.data[1] = 1;
        ws.data[2] = boards.get(topic)!;

        ws.publishBinary(topic, startAsX);
        ws.sendBinary(startAsO);
        break;
      }

      // Spectate
      default:
        ws.data[1] = 2;
        ws.sendBinary(startAsSpectator);

        // Spectator topic
        ws.subscribe(ws.data[3]);
        return;
    }

    ws.subscribe(topic);
  },

  close: (ws) => {
    // Simple handling for spectators
    if (ws.data[1] === 2) {
      ws.unsubscribe(ws.data[3]);
      return;
    }

    // Unsub first then check
    let topic = ws.data[0];
    ws.unsubscribe(topic);

    switch (server.subscriberCount(topic)) {
      // Delete the entire room if current
      // player is the only left
      case 0:
        boards.delete(topic);
        break;

      // One player just left
      case 1:
        {
          let msg = winMessages[1 - ws.data[1]];
          // Send wins to the other player
          server.publish(topic, msg);
          // Send wins to spectators
          server.publish(ws.data[3], msg);
          // Leave the room
          ws.close();
        }
        break;
    }
  },

  // Bun type bug
  message: ((ws: ServerWebSocket<Data>, msg: Uint8Array) => {
    let playerTurn = ws.data[1];
    // Don't handle spectator messages
    if (playerTurn === 2) return;

    switch (msg.length) {
      case 0: break;

      // TODO
      case 1: break;

      // [0, pos]
      case 2:
        if (msg[0] !== 0) break;

        {
          let board = ws.data[2]!;
          // The game has already finished
          if (board[3]) return;

          {
            let move = createMove(msg[1], playerTurn);
            // Send the move to players
            server.publish(ws.data[0], move);
            // Send the move to spectators
            ws.publishBinary(ws.data[3], move);
          }

          // Check if current player wins (get x and y first)
          if (mark(board[playerTurn], msg[1] >>> 4, msg[1] & 15)) {
            board[3] = true;

            // Send win to all players
            server.publish(ws.data[0], winMessages[playerTurn]);
            // Send win to other spectators
            ws.publishBinary(ws.data[3], winMessages[playerTurn]);
          }

          // After this turn the board is full
          else if (board[2] === 255) {
            board[3] = true;

            // Send draw to every player
            server.publish(ws.data[0], draw);
            // Send draw to every spectator
            ws.publishBinary(ws.data[3], draw);
          }

          // Count the moves
          board[2]++;
        }

        break;
    }
  }) as any
});
