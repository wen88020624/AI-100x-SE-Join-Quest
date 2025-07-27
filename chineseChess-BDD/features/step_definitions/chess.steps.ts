import { Given, When, Then } from '@cucumber/cucumber';
import { ChessService, Position, MoveResult } from '../../src/chess.service';

let chessService: ChessService;
let moveResult: MoveResult;

Given('the board is empty except for a Red General at \\({int}, {int}\\)', function (row: number, col: number) {
  chessService = new ChessService();
  chessService.clearBoard();
  chessService.placePiece('General', 'Red', { row, col });
});

Given('the board is empty except for a Red Guard at \\({int}, {int}\\)', function (row: number, col: number) {
  chessService = new ChessService();
  chessService.clearBoard();
  chessService.placePiece('Guard', 'Red', { row, col });
});

Given('the board is empty except for a Red Rook at \\({int}, {int}\\)', function (row: number, col: number) {
  chessService = new ChessService();
  chessService.clearBoard();
  chessService.placePiece('Rook', 'Red', { row, col });
});

Given('the board is empty except for a Red Horse at \\({int}, {int}\\)', function (row: number, col: number) {
  chessService = new ChessService();
  chessService.clearBoard();
  chessService.placePiece('Horse', 'Red', { row, col });
});

Given('the board is empty except for a Red Cannon at \\({int}, {int}\\)', function (row: number, col: number) {
  chessService = new ChessService();
  chessService.clearBoard();
  chessService.placePiece('Cannon', 'Red', { row, col });
});

Given('the board is empty except for a Red Elephant at \\({int}, {int}\\)', function (row: number, col: number) {
  chessService = new ChessService();
  chessService.clearBoard();
  chessService.placePiece('Elephant', 'Red', { row, col });
});

Given('the board is empty except for a Red Soldier at \\({int}, {int}\\)', function (row: number, col: number) {
  chessService = new ChessService();
  chessService.clearBoard();
  chessService.placePiece('Soldier', 'Red', { row, col });
});

Given('the board has:', function (dataTable) {
  chessService = new ChessService();
  chessService.clearBoard();
  
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const piece = row.Piece;
    const position = row.Position;
    // 解析位置 "(row, col)"
    const match = position.match(/\((\d+), (\d+)\)/);
    if (match) {
      const pieceRow = parseInt(match[1]);
      const pieceCol = parseInt(match[2]);
      
      // 解析棋子類型和顏色
      const [color, type] = piece.split(' ');
      chessService.placePiece(type, color as 'Red' | 'Black', { row: pieceRow, col: pieceCol });
    }
  });
});

When('Red moves the {word} from \\({int}, {int}\\) to \\({int}, {int}\\)', function (pieceType: string, fromRow: number, fromCol: number, toRow: number, toCol: number) {
  const from: Position = { row: fromRow, col: fromCol };
  const to: Position = { row: toRow, col: toCol };
  moveResult = chessService.makeMove(from, to);
});

Then('the move is legal', function () {
  if (!moveResult.isLegal) {
    throw new Error('Expected move to be legal, but it was illegal');
  }
});

Then('the move is illegal', function () {
  if (moveResult.isLegal) {
    throw new Error('Expected move to be illegal, but it was legal');
  }
});

Then('Red wins immediately', function () {
  if (!moveResult.isLegal || !moveResult.gameOver || moveResult.winner !== 'Red') {
    throw new Error('Expected Red to win immediately');
  }
});

Then('the game is not over just from that capture', function () {
  if (moveResult.gameOver) {
    throw new Error('Expected game to continue, but it ended');
  }
}); 