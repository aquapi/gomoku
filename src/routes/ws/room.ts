import { autoRoute, type ServerWebSocket } from 'ws-routers/bun';
import { server } from '@server';
import { createBoard, boards, type Board, startBoard, resetBoard, invalidTurn, invalidMove, detectWin, inGame } from '@/utils/game';
import { createMove, draw, startAsO, startAsSpectator, startAsX, syncBoard, winMessages } from '@/utils/message';

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
    // Stop the connection immediately
    // When the server is full
    if (boards.size > 5e3) {
      ws.close(1013);
      return;
    }

    // Prevent conflict with spectator rooms
    let topic = ws.data[0];
    if (topic.charCodeAt(0) === 36) {
      ws.close(1011);
      return;
    }

    ws.subscribe(topic);
    ws.data[3] = '$' + topic;
    ws.binaryType = 'uint8array';

    switch (server.subscriberCount(topic)) {
      // Initialize the board
      case 1:
        ws.data[1] = 0;
        ws.data[2] = createBoard(topic);
        break;

      // Start sending messages to the players
      case 2: {
        ws.data[1] = 1;
        ws.data[2] = startBoard(boards.get(topic)!);

        ws.publishBinary(topic, startAsX);
        ws.sendBinary(startAsO);
        break;
      }

      // Spectate
      default:
        ws.data[1] = 2;
        ws.sendBinary(startAsSpectator);

        // Sync the board with the current players
        let board = boards.get(topic)!;
        if (inGame(board))
          ws.sendBinary(syncBoard(board));

        // Spectator topic
        ws.subscribe(ws.data[3]);
        ws.unsubscribe(topic);
        return;
    }
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
          let board = ws.data[2]!;

          // Still in game
          if (inGame(board)) {
            let msg = winMessages[1 - ws.data[1]];
            // Send wins to the other player
            server.publish(topic, msg);
            // Send wins to spectators
            server.publish(ws.data[3], msg);
            // Mark game as done
            resetBoard(board);
          }
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
          // The game is not started
          // Or player try to move but not their turn
          if (invalidTurn(board, playerTurn)) return;

          let bpos = BigInt(msg[1]);
          // This position already has been registered
          if (invalidMove(board, bpos)) return;

          {
            let move = createMove(msg[1], playerTurn);
            // Send the move to players
            server.publish(ws.data[0], move);
            // Send the move to spectators
            ws.publishBinary(ws.data[3], move);
          }

          // Check if current player wins (get x and y first)
          if (detectWin(board, playerTurn, bpos)) {
            // Send win to all players
            server.publish(ws.data[0], winMessages[playerTurn]);
            // Send win to other spectators
            ws.publishBinary(ws.data[3], winMessages[playerTurn]);
            // Game done
            resetBoard(board);
          }

          // After this turn the board is full
          else if (board[2] === 255) {
            // Send draw to every player
            server.publish(ws.data[0], draw);
            // Send draw to every spectator
            ws.publishBinary(ws.data[3], draw);
            // Game done
            resetBoard(board);
          }

          // Count the moves
          else board[2]++;
        }

        break;
    }
  }) as any
});
