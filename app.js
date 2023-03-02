//Global Variables
const bodySelector = document.querySelector('.board')
const baseHTML = bodySelector.innerHTML;
let enRows = document.querySelectorAll('.enRow')
let playRows = document.querySelectorAll('.playRow')
let startGameButton = document.querySelector('#startGame')
let selectPhase = false;
let playerTurn = false;
let enGridArray = [];
let playGridArray = [];
let computerBrainArray = [];
let playerBoatCount = 0;
let computerBoatCount = 5;
let computerMode = 'Hunter';
let sightedBoat = null;

//Game Reset Function. Listeners need to be reset after HTML reset
function gameReset() {
    document.querySelector('.board').innerHTML = baseHTML
    recreateStartButton()
    startGameButton = document.querySelector('#startGame')
    addStartButtonListener()
    enRows = document.querySelectorAll('.enRow')
    playRows = document.querySelectorAll('.playRow')
    selectPhase = false;
    playerTurn = false;
    playerBoatCount = 0;
    computerBoatCount = 5;
    computerMode = 'Hunter';
    sightedBoat = null;
    console.log('Game has been reset')
}

//Random Number Generator
function randNumGen(min, max) {
    return Math.floor(Math.random() * ((max-min) + min))
}

//Building Class for tiles. Each tile will have boat stats, but boat presence will be toggled true or false at the beginning of the game

class TileStats {
    constructor() {
        this.boatPresent = false;
        this.health = 3;
        this.sighted = false;
        this.tileChecked = false;
        this.coordinates = null;
    }
}

//Building Boat Arrays. Can be latered modified for stretch feature of custome map size.
function buildTileArray() {
    enGridArray = [];
    playGridArray = [];
    computerBrainArray = [];
    for(let i = 0; i < enRows.length; i++) {
        let newRowArray = [];
        for(let j = 0; j < enRows[i].children.length; j++) {
             let newTile = new TileStats()
             newTile.coordinates = `${i}, ${j}`
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
    console.log('Added Player Listeners')
}


//Player Tile Logic

function selectBoatPosition(row, tile) {
    let boatObject = playGridArray[row][tile]
        boatElement = playRows[row].children[tile]
    if (boatObject.boatPresent == false) {
        boatObject.boatPresent = true;
        boatElement.style.backgroundColor = "grey";
        playerBoatCount = playerBoatCount + 1;
        console.log(playerBoatCount);
        if (playerBoatCount == 5) {
            selectPhase = false
        }
    } else {
        console.log("You've already put a boat there!")
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
    console.log('Adding Enemy Listeners')
}

//Functions defining enemy tile behavior during player turn
function playerOffensive(row, tile) {
    let boat = enGridArray[row][tile];
    console.log(`Shots fired at coordinates ${row}, ${tile}`);
    if (boat.boatPresent == true && boat.health > 0 && boat.sighted == true){
        boat.health -= 1;
        console.log(`Enemy boat hit at ${boat.coordinates}!`);
        if (boat.health == 0) {
            console.log (`Enemy boat at ${boat.coordinates} has been sunk!`)
            computerBoatCount -= 1;
        }
    } else if (boat.boatPresent == true && boat.health > 0 && boat.sighted == false) {
        boat.sighted = true;
        console.log(`Enemy boat sighted at ${boat.coordiantes}`)
    
    } else if (boat.boatPresent == true && boat.health <= 0) {
        console.log("You've already sunk that boat!")
    } else {
        console.log('Miss')
    }
    colorEnTiles(row, tile);
    playerTurn = false;
    checkGameOver()
    if (computerBoatCount > 0) {
        hunterKillerLogic();
    }
}
//Enemy tile color changer 

function colorEnTiles (row, tile) {
    let boat = enGridArray[row][tile]
    let boatElement = enRows[row].children[tile]
    if (boat.sighted == true) {
        boatElement.style.backgroundColor = 'grey';
    }
    if (boat.sighted == true && boat.health == 2) {
        boatElement.style.backgroundColor = 'yellow'
    } else if (boat.sighted == true && boat.health == 1) {
        boatElement.style.backgroundColor = 'orange'
    } else if (boat.sighted == true && boat.health == 0) {
        boatElement.style.backgroundColor = 'red'
    }
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

//Computer Hunter-Killer Logic

let randRowNum = null;
let randTileNum = null;
function hunterKillerLogic() {
    if (computerMode == 'Hunter' && playerBoatCount > 0) {
        randRowNum = null;
        randTileNum = null;
        randRowNum = randNumGen(0, (playGridArray.length))
        let randomRow = playGridArray[randRowNum];
        randTileNum = randNumGen(0, (randomRow.length))
        let randomTile = randomRow[randTileNum]
        console.log('Hunting');

        if (randomTile.tileChecked == true) {
            hunterKillerLogic()
        } else if (randomTile.boatPresent == false && randomTile.tileChecked == false && playerTurn == false) {
            randomTile.tileChecked = true;
            console.log('Empty Space Eliminated')
            playerTurn = true;

        } else if(randomTile.boatPresent == true && playerTurn == false) {
            computerMode = 'Killer';
            sightedBoat = randomTile;
            console.log(`The computer found your boat at ${sightedBoat.coordinates}!`)
            playerTurn = true;
        }
    } else if (computerMode == 'Killer' && playerTurn == false && playerBoatCount > 0) {
        console.log(`The computer is firing on your boat at ${sightedBoat.coordinates}!`)
        sightedBoat.health -= 1;
        if (sightedBoat.health <= 0) {
            console.log(`The computer sank your boat at ${sightedBoat.coordinates}!`)
            playerBoatCount -= 1;
            sightedBoat.tileChecked = true;
            sightedBoat = null;
            computerMode = 'Hunter'
        }
    playerTurn = true;
    }
    colorPlayTiles(randRowNum, randTileNum)
    checkGameOver()
    
}

//Player tile color changer 

function colorPlayTiles (row, tile) {
    let boat = playGridArray[row][tile]
    let boatElement = playRows[row].children[tile]
    if (boat.health == 2) {
        boatElement.style.backgroundColor = 'yellow'
    } else if (boat.health == 1) {
        boatElement.style.backgroundColor = 'orange'
    } else if (boat.health <= 0) {
        boatElement.style.backgroundColor = 'red'
    }
}


//Game over Logic
function checkGameOver() {
    if (playerBoatCount == 0) {
        let playerDecision = confirm('You were deafeated by the enemy fleet! Would you like to play again?');
        if (playerDecision == true) {
            gameReset()
        }
    }
     else if (computerBoatCount == 0) {
        let playerDecision = confirm('You defeated the enemy! Would you like to play again?');
        if (playerDecision == true) {
            gameReset()
        }
    }
}





//"Start Game" Logic
function addStartButtonListener() {
    startGameButton.addEventListener('click', function () {
        startGame();
    });
}

function recreateStartButton() {
    let newButton = document.createElement('button')
    newButton.id = 'startGame'
    newButton.innerText = 'Start Game'
    document.querySelector('body').appendChild(newButton)
}

addStartButtonListener()

function startGame() {
    console.log('Game starting')
    startGameButton.remove();
    buildTileArray();
    playTileListeners()
    enTileListeners()
    selectPhase = true;
}