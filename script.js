document.addEventListener("DOMContentLoaded", () => {
  const gridWidth = 15;
  const gridHeight = 15;
  const gridSize = gridHeight * gridWidth;
  const grid = createGrid();
  let startBtn = document.querySelector('.button');
  let scoreDisplay = document.querySelector('.score');
  let titleText = document.querySelector('.text-title')
  let squares = Array.from(grid.querySelectorAll('div'));
  let currentIndex = 0, currentRotation = 0;
  const width = 15;
  let score = 0;
  let timerId, nextRandom = 0;
  const colors = ['blue','lightgreen','purple','cyan','yellow'];

  function createGrid() {
    let grid = document.querySelector(".grid");
    for (let i = 0; i < gridSize; i++) {
      let gridElement = document.createElement("div");
      gridElement.setAttribute("class", "block1");
      grid.appendChild(gridElement);
    }

    for (let i = 0; i < gridWidth; i++) {
      let gridElement = document.createElement("div");
      gridElement.setAttribute("class", "baseBlock");
      grid.appendChild(gridElement);
    }
    return grid;
  }

  function control(e) {
    if (e.keyCode === 39) {
      moveright();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 37) {
      moveleft();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener('keydown', control);

  const lTetromino = [ //====
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth + 3, gridWidth + 4],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth + 3, gridWidth + 4],
  ];

  const zTetromino = [ // ==
                       //==
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2 + 2, gridWidth * 3 + 2],
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2 + 2, gridWidth * 3 + 2],
  ];

  const tTetromino = [//===  
                      // =
    [gridWidth * 2 + 1, gridWidth * 2 + 2, gridWidth + 2, gridWidth * 2 + 3],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth + 2],
    [gridWidth + 1, gridWidth + 2, gridWidth + 3, gridWidth * 2 + 2],
    [1, gridWidth, gridWidth * 2 + 1, gridWidth + 1],
  ];

  const oTetromino = [//==
                      //== 
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1]
  ];

  const iTetromino = [//===
                      //  =
    [1, gridWidth + 1, gridWidth + 2, gridWidth + 3],
    [gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth + 3, gridWidth * 2 + 3],
    [gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1, gridWidth * 3],
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];
  let currentPosition = 4;

  function moveright() {
    undraw()
    const isAtRightEdge = current.some(index => ((currentPosition + index) % width) == (width - 1));
    if (!isAtRightEdge) {
      currentPosition += 1;
    }
    if (current.some(index => squares[currentPosition + index].classList.contains('block'))) {
      currentPosition -= 1;
    }
    draw();
  }

  function moveleft() {
    if(timerId != null){
      undraw()
      const isAtLeftEdge = current.some(index => ((currentPosition + index) % width) == 0);
      if (!isAtLeftEdge) {
        currentPosition -= 1;
      }
      if (current.some(index => squares[currentPosition + index].classList.contains('block'))) {
        currentPosition += 1;
      }
      draw();
    }
  }

  function moveDown() {
    if(timerId != null){
      undraw();
      currentPosition += width
      draw();
      freeze();
    }
  }
 
  function rotate() {
    if(timerId != null){
      undraw();
      currentRotation++;
      if (currentRotation == current.length) {
        currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
      draw();
  }
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('baseBlock'))){
      current.forEach(index => squares[index + currentPosition].classList.add('baseBlock'));
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      random = nextRandom;
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      addScore();
      gameOver();
    }
  }

  function draw() {
    current.forEach(index => {
      console.log(currentPosition + " " + index);
      squares[currentPosition + index].classList.add('block');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('block');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
    }
  })

  function addScore() {
    for(currentIndex = 0; currentIndex < gridSize; currentIndex += gridWidth){
      const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9, currentIndex + 10, currentIndex + 11, currentIndex + 12, currentIndex + 13, currentIndex + 14];
      if(row.every(index => squares[index].classList.contains('baseBlock'))){
        console.log("yes");
        score += 15;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].style.backgroundColor = '';
          squares[index].classList.remove('baseBlock');
        });
        const squaresRemoved = squares.splice(currentIndex ,width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
        
      }
    }
  }

  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('baseBlock'))){
      scoreDisplay.innerHTML = "Score : " + score;
      titleText.innerHTML = "Gameover"
      clearInterval(timerId);
      timerId = null
      document.getElementById('btn-1').style.display = 'block'
    }
  }
})   

function playAgain(){
  location.reload();
}