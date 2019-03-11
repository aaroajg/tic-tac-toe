import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
        {props.winnerTiles && props.winnerTiles.indexOf(props.iValue) !== -1 ? <b style={{ color: 'red' }}>{props.value}</b> : props.value}
    </button>
  );  
}
  
class Board extends React.Component {
  renderSquare(i) {
    return <Square 
              value={this.props.squares[i]} 
              iValue={i}
              onClick={() => this.props.onClick(i)}
              winnerTiles={this.props.winnerTiles}
          />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      location: [],
      active: null
    };
  }

  handleClick = i => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const location = this.state.location.slice(0, this.state.stepNumber);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        location: location.concat([i])
      })
    }
  }

  jumpTo = (e, step) => {
    e.preventDefault();
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      active: e.target.value
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move + ' (' + (Math.ceil(this.state.location[move-1] % 3) === 0 ? Math.ceil(this.state.location[move-1] / 3 + 1) : Math.ceil(this.state.location[move-1] / 3)) + ', ' + (this.state.location[move-1] % 3 + 1) + ')' : 
        'Go to game start';
      
      return(
        <li key={move}>
          <button className={this.state.active === desc ? 'active' : ''} onClick={(e) => this.jumpTo(e, move)} value={desc}>
            {desc}
          </button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      if(history.length === 10) 
        status = 'It is a Draw!';
      else
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winnerTiles={winner} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  
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
      return [a, b, c, squares[a]];
    }
  }
  return null;
}