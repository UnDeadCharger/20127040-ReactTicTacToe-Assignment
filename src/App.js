import { useState } from "react";
import "./App.css";

function Square({ winner, value, onSquareClick }) {
  return (
    <button
      className={`square
        ${winner ? `winningButton` : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
function Board({ xIsNext, currentMove, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winStatus = calculateWinner(squares);
  let status;
  if (winStatus) {
    status = "Winner: " + winStatus.winner;
  } else if (currentMove >= 9) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const renderSquare = (i) => {
    let winningSquare =
      winStatus && winStatus.winningLine.includes(i) ? true : false;
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        winner={winningSquare}
      />
    );
  };

  const renderRow = (rowIndex) => {
    const row = [];
    for (let i = 0; i < 3; i++) {
      row.push(renderSquare(rowIndex * 3 + i));
    }
    return (
      <div className="board-row" key={rowIndex}>
        {row}
      </div>
    );
  };

  const rows = [];
  for (let i = 0; i < 3; i++) {
    rows.push(renderRow(i));
  }

  return (
    <>
      <div className="status">{status}</div>

      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index) {
    nextSquares.push(index);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description, row, col;
    if (
      history[move][history[move].length - 1] ||
      history[move][history[move].length - 1] == 0
    ) {
      const latestMoveSquare = history[move][history[move].length - 1];
      col = 1 + (latestMoveSquare % 3);
      row = 1 + Math.floor(latestMoveSquare / 3);
    }
    if (move > 0) {
      description = "Go to move #" + move + ` (row: ${row}, col: ${col})`;
    } else {
      description = "Go to game start";
    }
    if (row > 0 && col > 0) console.log(true);
    return (
      <li key={move}>
        {currentMove !== move ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <div>
            you are at #{move}{" "}
            {(row > 0) & (col > 0) ? `(row: ${row}, col: ${col})` : ""}
          </div>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          currentMove={currentMove}
          squares={currentSquares}
          onPlay={handlePlay}
        />
        <button onClick={() => setIsAscending(!isAscending)}>
          Change move list order
        </button>
      </div>

      <div className="game-info">
        {isAscending ? <ol>{moves}</ol> : <ol reversed>{moves.reverse()}</ol>}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return null;
}
