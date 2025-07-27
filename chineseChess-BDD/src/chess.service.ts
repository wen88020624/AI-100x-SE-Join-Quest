export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  type: string;
  color: 'Red' | 'Black';
  position: Position;
}

export interface MoveResult {
  isLegal: boolean;
  gameOver?: boolean;
  winner?: 'Red' | 'Black';
}

export class ChessService {
  private board: (Piece | null)[][] = [];

  constructor() {
    this.initializeEmptyBoard();
  }

  private initializeEmptyBoard(): void {
    this.board = Array(10).fill(null).map(() => Array(9).fill(null));
  }

  public clearBoard(): void {
    this.initializeEmptyBoard();
  }

  public placePiece(type: string, color: 'Red' | 'Black', position: Position): void {
    const piece: Piece = { type, color, position };
    this.board[position.row - 1][position.col - 1] = piece;
  }

  public makeMove(from: Position, to: Position): MoveResult {
    const piece = this.getPieceAt(from);
    if (!piece) {
      return { isLegal: false };
    }

    // 檢查是否是將軍的移動
    if (piece.type === 'General') {
      return this.validateGeneralMove(from, to, piece.color);
    }

    // 檢查是否是衛士的移動
    if (piece.type === 'Guard') {
      return this.validateGuardMove(from, to, piece.color);
    }

    // 檢查是否是車的移動
    if (piece.type === 'Rook') {
      return this.validateRookMove(from, to, piece.color);
    }

    // 檢查是否是馬的移動
    if (piece.type === 'Horse') {
      return this.validateHorseMove(from, to, piece.color);
    }

    // 檢查是否是炮的移動
    if (piece.type === 'Cannon') {
      return this.validateCannonMove(from, to, piece.color);
    }

    // 其他棋子邏輯待實作
    return { isLegal: false };
  }

  private validateGeneralMove(from: Position, to: Position, color: 'Red' | 'Black'): MoveResult {
    // 宮殿範圍檢查
    const isInPalace = this.isInPalace(to, color);
    if (!isInPalace) {
      return { isLegal: false };
    }

    // 移動距離檢查（一次只能移動一格）
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // 將軍只能橫向或縱向移動一格，不能斜向移動
    if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
      return { isLegal: false };
    }

    // 檢查移動後是否會造成將軍面對面
    if (this.wouldGeneralsFaceEachOther(from, to, color)) {
      return { isLegal: false };
    }

    return { isLegal: true };
  }

  private validateGuardMove(from: Position, to: Position, color: 'Red' | 'Black'): MoveResult {
    // 宮殿範圍檢查（起始位置和目標位置都必須在宮殿內）
    if (!this.isInPalace(from, color) || !this.isInPalace(to, color)) {
      return { isLegal: false };
    }

    // 移動距離檢查（必須是斜向移動一格）
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // 衛士只能斜向移動一格
    if (rowDiff === 1 && colDiff === 1) {
      return { isLegal: true };
    }

    return { isLegal: false };
  }

  private validateRookMove(from: Position, to: Position, color: 'Red' | 'Black'): MoveResult {
    // 檢查是否是橫向或縱向移動
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // 車只能橫向或縱向移動，不能斜向移動
    if (!((rowDiff === 0 && colDiff > 0) || (rowDiff > 0 && colDiff === 0))) {
      return { isLegal: false };
    }

    // 檢查路徑是否清空（沒有其他棋子阻擋）
    if (!this.isPathClear(from, to)) {
      return { isLegal: false };
    }

    return { isLegal: true };
  }

  private validateHorseMove(from: Position, to: Position, color: 'Red' | 'Black'): MoveResult {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // 馬只能走"日"字型：2+1 的移動
    if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
      return { isLegal: false };
    }

    // 檢查「蹩腳」：移動方向上的相鄰位置是否有棋子阻擋
    let legPosition: Position;
    
    if (rowDiff === 2) {
      // 縱向移動2格，蹩腳位置在縱向中間
      const middleRow = from.row + (to.row > from.row ? 1 : -1);
      legPosition = { row: middleRow, col: from.col };
    } else {
      // 橫向移動2格，蹩腳位置在橫向中間
      const middleCol = from.col + (to.col > from.col ? 1 : -1);
      legPosition = { row: from.row, col: middleCol };
    }

    // 如果蹩腳位置有棋子，則移動非法
    if (this.getPieceAt(legPosition)) {
      return { isLegal: false };
    }

    return { isLegal: true };
  }

  private validateCannonMove(from: Position, to: Position, color: 'Red' | 'Black'): MoveResult {
    // 檢查是否是橫向或縱向移動
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // 炮只能橫向或縱向移動，不能斜向移動
    if (!((rowDiff === 0 && colDiff > 0) || (rowDiff > 0 && colDiff === 0))) {
      return { isLegal: false };
    }

    const targetPiece = this.getPieceAt(to);
    
    if (!targetPiece) {
      // 移動到空位：像車一樣，路徑必須清空
      if (!this.isPathClear(from, to)) {
        return { isLegal: false };
      }
    } else {
      // 攻擊敵方棋子：需要恰好一個炮台
      if (targetPiece.color === color) {
        return { isLegal: false }; // 不能攻擊己方棋子
      }
      
      // 計算路徑上的棋子數量（不包括起點和終點）
      const piecesInPath = this.countPiecesInPath(from, to);
      if (piecesInPath !== 1) {
        return { isLegal: false }; // 需要恰好一個炮台
      }
    }

    return { isLegal: true };
  }

  private countPiecesInPath(pos1: Position, pos2: Position): number {
    let count = 0;
    
    if (pos1.row === pos2.row) {
      // 同一行
      const startCol = Math.min(pos1.col, pos2.col) + 1;
      const endCol = Math.max(pos1.col, pos2.col) - 1;
      for (let col = startCol; col <= endCol; col++) {
        if (this.getPieceAt({ row: pos1.row, col })) {
          count++;
        }
      }
    } else if (pos1.col === pos2.col) {
      // 同一列
      const startRow = Math.min(pos1.row, pos2.row) + 1;
      const endRow = Math.max(pos1.row, pos2.row) - 1;
      for (let row = startRow; row <= endRow; row++) {
        if (this.getPieceAt({ row, col: pos1.col })) {
          count++;
        }
      }
    }
    
    return count;
  }

  private isInPalace(position: Position, color: 'Red' | 'Black'): boolean {
    const { row, col } = position;
    
    if (color === 'Red') {
      // 紅方宮殿：行 1-3，列 4-6
      return row >= 1 && row <= 3 && col >= 4 && col <= 6;
    } else {
      // 黑方宮殿：行 8-10，列 4-6
      return row >= 8 && row <= 10 && col >= 4 && col <= 6;
    }
  }

  private wouldGeneralsFaceEachOther(from: Position, to: Position, color: 'Red' | 'Black'): boolean {
    // 模擬移動：暫時移動棋子
    const originalPiece = this.getPieceAt(from);
    const targetPiece = this.getPieceAt(to);
    
    // 執行移動
    this.board[from.row - 1][from.col - 1] = null;
    this.board[to.row - 1][to.col - 1] = originalPiece;

    // 找到對方將軍的位置
    const opponentColor = color === 'Red' ? 'Black' : 'Red';
    const opponentGeneral = this.findGeneral(opponentColor);
    
    let faceEachOther = false;
    
    if (opponentGeneral) {
      // 檢查是否在同一行或列
      if (to.row === opponentGeneral.row || to.col === opponentGeneral.col) {
        // 檢查中間是否有棋子阻擋
        faceEachOther = this.isPathClear(to, opponentGeneral);
      }
    }

    // 還原移動
    this.board[from.row - 1][from.col - 1] = originalPiece;
    this.board[to.row - 1][to.col - 1] = targetPiece;

    return faceEachOther;
  }

  private findGeneral(color: 'Red' | 'Black'): Position | null {
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 9; col++) {
        const piece = this.getPieceAt({ row, col });
        if (piece && piece.type === 'General' && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  }

  private isPathClear(pos1: Position, pos2: Position): boolean {
    // 檢查兩點之間是否有棋子阻擋
    if (pos1.row === pos2.row) {
      // 同一行
      const startCol = Math.min(pos1.col, pos2.col) + 1;
      const endCol = Math.max(pos1.col, pos2.col) - 1;
      for (let col = startCol; col <= endCol; col++) {
        if (this.getPieceAt({ row: pos1.row, col })) {
          return false; // 有棋子阻擋
        }
      }
    } else if (pos1.col === pos2.col) {
      // 同一列
      const startRow = Math.min(pos1.row, pos2.row) + 1;
      const endRow = Math.max(pos1.row, pos2.row) - 1;
      for (let row = startRow; row <= endRow; row++) {
        if (this.getPieceAt({ row, col: pos1.col })) {
          return false; // 有棋子阻擋
        }
      }
    }
    return true; // 路徑清空
  }

  public getPieceAt(position: Position): Piece | null {
    return this.board[position.row - 1][position.col - 1];
  }
} 