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
let playerBoatCount = 0;
let computerBoatCount = 0;
let computerMode = 'Hunter';
let sightedBoat = null;

//Game Reset Function. Listeners need to be reapplied after HTML reset
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
    computerBoatCount = 0;
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
        this.sunk = false;
    }
}

//Building Boat Arrays. Can be latered modified for stretch feature of custome map size.
function buildEnTileArray() {
    enGridArray = [];
    for(let i = 0; i < enRows.length; i++) {
        let newRowArray = [];
        for(let j = 0; j < enRows[i].children.length; j++) {
             let newTile = new TileStats()
             newTile.coordinates = `${i}, ${j}`
            newRowArray.push(newTile)
        }
        enGridArray.push(newRowArray)
    }
}

function buildPlayerTileArray() {
    playGridArray = [];
    for(let i = 0; i < playRows.length; i++) {
        let newRowArray = [];
        for(let j = 0; j < playRows[i].children.length; j++) {
             let newTile = new TileStats()
             newTile.coordinates = `${i}, ${j}`
            newRowArray.push(newTile)
        }
        playGridArray.push(newRowArray)
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


//Player Tile Logic for selecting player boat positions

function selectBoatPosition(row, tile) {
    let boatObject = playGridArray[row][tile]
        boatElement = playRows[row].children[tile]
    
    if (boatObject.boatPresent == true) {
        console.log("You've already put a boat there!")
    } else if (boatObject.boatPresent == false) {
        boatObject.boatPresent = true;
        boatElement.style.backgroundColor = "grey";
        playerBoatCount = playerBoatCount + 1;
        console.log(playerBoatCount);
    }
    if (playerBoatCount == 5) {
            selectPhase = false
            playerTurn = true
    }
}



// Enemy tile listeners
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
    console.log('Added Enemy Listeners')
}

//Functions defining enemy tile behavior during player turn
function playerOffensive(row, tile) {
    let boat = enGridArray[row][tile];
    if (boat.boatPresent == false) {
        console.log('Miss')
    }  else if (boat.boatPresent == true && boat.sunk == true) {
        console.log("You've already sunk that boat!") 
    } else if (boat.boatPresent == true && boat.sighted == false) {
        boat.sighted = true;
        console.log(`Enemy boat sighted at ${boat.coordinates}`)
    
    } else if (boat.boatPresent == true && boat.sunk == false && boat.sighted == true){
        boat.health -= 1;
        console.log(`Enemy boat hit at ${boat.coordinates}!`);
        if (boat.health == 0) {
            console.log (`Enemy boat at ${boat.coordinates} has been sunk!`)
            computerBoatCount -= 1;
            boat.sunk = true;
        }
    }
    colorEnTiles(row, tile);
    //sound effect placeholder
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
    if (boat.sighted == true && boat.health == 3) {
        boatElement.style.backgroundColor = 'grey';
    } else if (boat.sighted == true && boat.health == 2) {
        boatElement.style.backgroundColor = 'yellow'
    } else if (boat.sighted == true && boat.health == 1) {
        boatElement.style.backgroundColor = 'orange'
    } else if (boat.sighted == true && boat.health <= 0) {
        boatElement.style.backgroundColor = 'red'
    }
}

//Computer Boat Selection Logic

function selectEnemyBoats() {
    while (computerBoatCount < 5) {
        computerBoatSelector();
        computerBoatCount += 1;
    }
}

function computerBoatSelector() {
    let randomRow = enGridArray[randNumGen(0, (enGridArray.length))]
    let randomTile = randomRow[randNumGen(0, (randomRow.length))] 
    if (randomTile.boatPresent == true) {
        computerBoatSelector();
    } else if (randomTile.boatPresent == false) {
        randomTile.boatPresent = true;
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
        let hitChance = Math.random()
        if (hitChance >= .5) {
            sightedBoat.health -= 1;
        } else if (hitChance < .5) {
            console.log('THe enemy missed!')
        }
        if (sightedBoat.health <= 0) {
            console.log(`The computer sank your boat at ${sightedBoat.coordinates}!`)
            playerBoatCount -= 1;
            sightedBoat.tileChecked = true;
            sightedBoat = null;
            computerMode = 'Hunter'
        }
    playerTurn = true;
    }
    //sound effect placeholder
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
        playerTurn = null;
        let playerDecision = confirm('You were deafeated by the enemy fleet! Would you like to play again?');
        if (playerDecision == true) {
            gameReset()
        }
    }
     else if (computerBoatCount == 0) {
        playerTurn == null;
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
    buildEnTileArray()
    buildPlayerTileArray()
    playTileListeners()
    enTileListeners()
    selectEnemyBoats()
    selectPhase = true;
}