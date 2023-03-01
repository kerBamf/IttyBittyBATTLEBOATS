//Global Variables
const baseHTML = document.querySelector('body').innerHTML
const allTiles = document.querySelectorAll('.tile')
const enRows = document.querySelectorAll('.enRow')
const playRows = document.querySelectorAll('.playRow')
const startGameButton = document.querySelector('#startGame')
let selectPhase = false;
let playerTurn = false;
let enGridArray = [];
let playGridArray = [];
let computerBrainArray = [];
let playerBoatCount = 0;
let computerBoatCount = 0;

//Game Reset Function
function gameReset() {
    let currentHTML = document.querySelector('body')
    currentHTML = baseHTML
    selectPhase = false;
    playerTurn = false;
    enGridArray = [];
    playGridArray = [];
    computerBrainArray = [];
    playerBoatCount = 0;
    computerBoatCount = 0;
}

//Random Number Generator
function randNumGen(min, max) {
    return Math.floor(math.random() * (max-min) + min)
}

//Building Class for tiles. Each tile will have boat stats, but boat presence will be toggled true or false at the beginning of the game

class TileStats {
    constructor() {
        this.boatPresent = false;
        this.health = 3;
        this.sighted = false;
        this.tileChecked = false;
    }
}

//Building Boat Arrays. Can be latered modified for stretch feature of custome map size.
function buildTileArray() {
    for(let i = 0; i < enRows.length; i++) {
        let newRowArray = [];
        for(let j = 0; j < enRows[i].children.length; j++) {
             let newTile = new TileStats()
            newRowArray.push(newTile)
        }
        enGridArray.push(newRowArray)
        playGridArray.push(newRowArray)
        computerBrainArray.push(newRowArray)
    }
}


//Player Tile Listeners

function playTileListeners() {
    for(let i = 0; i < playRows.length; i++) {
        let tiles = playRows[i].children;
        for (let j = 0; j < tiles.length; j++) {
            tiles[j].addEventListener('click', function() {
               if (selectPhase == true) {
                    selectBoatPosition(i, j)
               }
               
            })
        }
    }
}


//Player Tile Logic

function selectBoatPosition(row, tile) {
    playGridArray[row][tile].boatPresent = true;
    playRows[row].children[tile].style.backgroundColor = "grey";
    playerBoatCount = playerBoatCount + 1;
    console.log(playerBoatCount);
    if (playerBoatCount == 5) {
        selectPhase = false
    }

}



// New Listener currently populated with hit/miss logic, deriving coordinates from iterators. This will allow listeners to be accurately applied regardless of grid size, and will match associated boat-stat array(s) since they both use the same iterators. Later version will execute different functions based on "game-state" variables yet to be coded.
function enTileListeners() {

    for(let i = 0; i < enRows.length; i++) {
        let tiles = enRows[i].children;
        for (let j = 0; j < tiles.length; j++) {
            tiles[j].addEventListener('click', function() {
               if (playerTurn == true) {
                playerOffensive(i, j)
               }
               
            })
        }
    }
}

//Functions defining enemy tile behavior during player turn
function playerOffensive(row, tile) {
    let boat = enGridArray[row][tile];
    console.log(`Shots fired at ${row}, ${tile}`);
    if (boat.boatPresent == true){
        boat.health -= 1;
        console.log('Enemy boat hit!');
        console.log(enGridArray[row][tile].health)
    } else {
        console.log('Miss')
    }
}

playTileListeners()
enTileListeners()

//"Start Game" Logic

startGameButton.addEventListener('click', function () {
    playGame();
});

function playGame() {
    console.log('Game starting')
    startGameButton.remove();
    buildTileArray();
    selectPhase = true;
}

//Computer Boat Selection Logic

function selectEnemyBoats() {
    while (computerBoatCount < 5) {
        computerBoatSelector();
    }
}

function computerBoatSelector() {
    let randomRow = enGridArray[randNumGen(0, (enGridArray.length-1))]
    let randomTile = randomRow[randNumGen(0, (randomRow.length-1))]
    if (randomTile.boatPresent = false) {
        randomTile.boatPresent = true;
        computerBoatCount = computerBoatCount + 1;
    } else {
        computerBoatSelector();
    }
}


