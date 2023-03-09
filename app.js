//Global Variables
const bodySelector = document.querySelector('.board')
const baseHTML = bodySelector.innerHTML;
let selectInstructions = document.querySelector('#placeBoats')
let attackInstructions = document.querySelector('#findBoats')
let enRows = document.querySelectorAll('.enRow')
let playRows = document.querySelectorAll('.playRow')
let startGameButton = document.querySelector('#startGame')
let playerLabel = document.querySelector('#playerLabel')
let enemyLabel = document.querySelector('#enemyLabel')
let selectPhase = false;
let playerTurn = false;
let enGridArray = [];
let playGridArray = [];
let playerBoatCount = 0;
let computerBoatCount = 0;
let computerMode = 'Hunter';
let sightedBoat = null;
let randRowNum = null;
let randTileNum = null;
let playerHitPercent = .80;
let enemyHitPercent = .75;
let computerSearchCount = 0;
let computerSearchMax = 15;
let boatMax = 8;
let fleetFirepower = false;
const difDescription = document.querySelector('#difDescription')
const fireCheckbox = document.querySelector('#fireCheckbox')
const settingsMenu = document.querySelector('#settings')
const closeButton = document.querySelector('#close')
const easyButton = document.querySelector('#easy')
const normalButton = document.querySelector('#normal')
const hardButton = document.querySelector('#hard')
const defeatWindow = document.querySelector('#defeat');
const victoryWindow = document.querySelector('#victory');

//Game Reset Function. Listeners need to be reapplied after HTML reset
function gameReset() {
    let board = document.querySelector('.board');
    board.innerHTML = baseHTML;
    recreateStartButton()
    startGameButton = document.querySelector('#startGame')
    addStartButtonListener()
    enRows = document.querySelectorAll('.enRow')
    playRows = document.querySelectorAll('.playRow')
    selectInstructions = document.querySelector('#placeBoats')
    attackInstructions = document.querySelector('#findBoats')
    playerLabel = document.querySelector('#playerLabel')
    enemyLabel = document.querySelector('#enemyLabel')
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

// Boat count display functions
function playerBoatsRemaining() {
    playerLabel.innerText = `Player Boats: ${playerBoatCount}`
}

function enemyBoatsRemaining() {
    enemyLabel.innerText = `Enemy Boats: ${computerBoatCount}`
}

// Boat Graphic functions
function addEnemyBoatGraphic(row, tile) {
        let boatGraphic = document.createElement('img')
        boatGraphic.style.height = '72px'
        boatGraphic.style.width = '72px'
        boatGraphic.style.margin = '0'
        boatGraphic.style.padding = '0';
        boatGraphic.src = './assets/enemyBoat.png'
        enRows[row].children[tile].appendChild(boatGraphic)
}

function addPlayerBoatGraphic(row, tile) {
        let boatGraphic = document.createElement('img')
        boatGraphic.style.height = '72px'
        boatGraphic.style.width = '72px'
        boatGraphic.style.margin = '0'
        boatGraphic.style.padding = '0';
        boatGraphic.src = './assets/friendlyBoat.png'
        playRows[row].children[tile].appendChild(boatGraphic)
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
            tiles[j].addEventListener('mouseenter', function() {
                if (selectPhase == true) {
                    highlightPlayerTile(i, j);
                }
            })
            tiles[j].addEventListener('mouseleave', function() {
                restorePlayerTileDefault(i, j);
            })
        }
    }
    console.log('Added Player Listeners')
}


//Player Tile Logic for selecting player boat positions. Also calls computerBoatSelector for simultaneous update

function selectBoatPosition(row, tile) {
    let boatObject = playGridArray[row][tile]
        boatElement = playRows[row].children[tile]
        boatImage = boatElement.firstChild
    if (boatObject.boatPresent == true) {
        console.log("You've already put a boat there!")
    } else if (boatObject.boatPresent == false) {
        boatObject.boatPresent = true;
        playerBoatCount = playerBoatCount + 1;
        console.log(playerBoatCount);
        addPlayerBoatGraphic(row, tile);
        computerBoatSelector();
    }
    playerBoatsRemaining();
    if (playerBoatCount == boatMax) {
            selectPhase = false
            playerTurn = true
            selectInstructions.style.opacity = '0';
            attackInstructions.style.opacity = '1';
    }
}

function highlightPlayerTile(row, tile) {
    let boatElement = playRows[row].children[tile]
    let boatObject = playGridArray[row][tile]
    if (boatObject.boatPresent == false) {
        boatElement.style.backgroundColor = "rgb(0, 175, 175)"
    }
}

function restorePlayerTileDefault(row, tile) {
    let boatElement = playRows[row].children[tile]
    if (boatElement.style.backgroundColor == "rgb(0, 175, 175)") {
        boatElement.style.backgroundColor = "rgb(0, 255, 255"
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
            tiles[j].addEventListener('mouseenter', function() {
                if (playerTurn == true) {
                    highlightEnemyTile(i, j);
                }
            })
            tiles[j].addEventListener('mouseleave', function() {
                restoreEnemyTileDefault(i, j);  
            })
        }
    }
    console.log('Added Enemy Listeners')
}



//Functions defining enemy tile behavior during player turn
function playerOffensive(row, tile) {
    let boat = enGridArray[row][tile];
    let boatElement = enRows[row].children[tile]
    let boatImage = boatElement.firstChild
    if (boat.boatPresent == false) {
        console.log('Miss')
    }  else if (boat.boatPresent == true && boat.sunk == true) {
        console.log("You've already sunk that boat!") 
    } else if (boat.boatPresent == true && boat.sighted == false) {
        boat.sighted = true;
        console.log(`Enemy boat sighted at ${boat.coordinates}`)
    
    } else if (boat.boatPresent == true && boat.sunk == false && boat.sighted == true){
        let hitChance = Math.random()
        if (hitChance <= playerHitPercent) {
            if (playerBoatCount == boatMax && fleetFirepower == true) {
                boat.health -= 2;
            } else {
                boat.health -= 1;
            }
            console.log(`Enemy boat hit at ${boat.coordinates}!`);
            if (boat.health <= 0) {
                console.log (`Enemy boat at ${boat.coordinates} has been sunk!`)
                computerBoatCount -= 1;
                boatImage.src = 'https://media.tenor.com/ptNG8DQFPD4AAAAj/explotion-explode.gif'
                setTimeout(function () {
                    boatImage.src = './assets/enemySunk.png'
                }, 1000)
                boat.sunk = true;
            }
        } else if (hitChance > playerHitPercent) {
            console.log("The player's volley missed!")
        }
    }
    colorEnTiles(row, tile);
    //sound effect placeholder
    playerTurn = false;
    enemyBoatsRemaining();
    checkGameOver()
    if (computerBoatCount > 0) {
        hunterKillerLogic();
    }
}

//Enemy tile color changers 
function colorEnTiles (row, tile) {
    let boat = enGridArray[row][tile]
    let boatElement = enRows[row].children[tile]
    let boatImage = boatElement.firstChild
    if (boat.sighted == true && boat.health == 3 && boatImage === null) {
        addEnemyBoatGraphic(row, tile)
    } else if (boat.sighted == true && boat.health == 2) {
        boatElement.style.backgroundColor = 'yellow'
    } else if (boat.sighted == true && boat.health == 1) {
        boatElement.style.backgroundColor = 'orange'
    } else if (boat.sighted == true && boat.health <= 0) {
        boatElement.style.backgroundColor = 'red'
    }
}

function highlightEnemyTile(row, tile) {
    let boatObject = enGridArray[row][tile]
    let boatElement = enRows[row].children[tile]
    if (boatObject.sighted == false) {
        boatElement.style.backgroundColor = "rgb(0, 175, 175";
    }
}

function restoreEnemyTileDefault(row, tile) {
    let boatElement = enRows[row].children[tile]
    let boatObject = enGridArray[row][tile]
    if (boatElement.style.backgroundColor == "rgb(0, 175, 175)") {
        boatElement.style.backgroundColor = "rgb(0, 255, 255"
    }
}

function computerBoatSelector() {
    let randomRow = enGridArray[randNumGen(0, (enGridArray.length))]
    let randomTile = randomRow[randNumGen(0, (randomRow.length))] 
    if (randomTile.boatPresent == true) {
        computerBoatSelector();
    } else if (randomTile.boatPresent == false) {
        randomTile.boatPresent = true;
        computerBoatCount += 1;
    } 
    enemyBoatsRemaining();
}


//Computer Hunter-Killer Logic

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
            computerSearchCount += 1
            console.log(`Enemy search count: ${computerSearchCount}`)
            if (computerSearchCount == computerSearchMax) {
                computerSearchCount = 0;
                playerTurn = true;
            } else {
                hunterKillerLogic()
            }
        } else if (randomTile.boatPresent == false && randomTile.tileChecked == false && playerTurn == false) {
            computerSearchCount = 0
            randomTile.tileChecked = true;
            console.log('Empty Space Eliminated')
            playerTurn = true;

        } else if(randomTile.boatPresent == true && playerTurn == false) {
            computerSearchCount = 0;
            computerMode = 'Killer';
            sightedBoat = randomTile;
            console.log(`The computer found your boat at ${sightedBoat.coordinates}!`)
            playerTurn = true;
        }
    } else if (computerMode == 'Killer' && playerTurn == false && playerBoatCount > 0) {
        console.log(`The computer is firing on your boat at ${sightedBoat.coordinates}!`)
        let hitChance = Math.random()
        if (hitChance <= enemyHitPercent) {
            if (computerBoatCount == boatMax && fleetFirepower == true) {
                sightedBoat.health -= 2;
            } else {
                sightedBoat.health -= 1;
            }
        } else if (hitChance > enemyHitPercent) {
            console.log('The enemy missed!')
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
    playerBoatsRemaining()
    colorPlayTiles(randRowNum, randTileNum)
    checkGameOver()
    
}

//Player tile color changer 

function colorPlayTiles (row, tile) {
    let boat = playGridArray[row][tile]
    let boatElement = playRows[row].children[tile]
    let boatImage = boatElement.firstChild
    if (boat.health == 2) {
        boatElement.style.backgroundColor = 'yellow'
    } else if (boat.health == 1) {
        boatElement.style.backgroundColor = 'orange'
    } else if (boat.health <= 0) {
        boatImage.src = 'https://media.tenor.com/ptNG8DQFPD4AAAAj/explotion-explode.gif'
            setTimeout(function () {
                boatImage.src = './assets/friendlySunk.png'
            }, 1000)
        boatElement.style.backgroundColor = 'red'
    }
}


//Game over Logic
function checkGameOver() {
    if (playerBoatCount == 0) {
        playerTurn = null;
        defeatWindow.style.display = 'block';

        } else if (computerBoatCount == 0) {
        playerTurn == null;
        victoryWindow.style.display = 'block';
    }
}

//Game over button event listeners
const startOverButtons = document.querySelectorAll('.playAgain')
const leaveMeButtons = document.querySelectorAll('.notAgain')
for (let i = 0; i < startOverButtons.length; i++) {
    startOverButtons[i].addEventListener('click', function () {
        defeatWindow.style.display = 'none';
        victoryWindow.style.display = 'none';
        gameReset()
    })
}
for (let i = 0; i < leaveMeButtons.length; i++) {
    leaveMeButtons[i].addEventListener('click', function () {
        defeatWindow.style.display = 'none';
        victoryWindow.style.display = 'none';
        selectInstructions.innerText = 'A quiet settles...'
        selectInstructions.style.opacity = "1"
        attackInstructions.innerText = '...over war-torn ocean...'
        attackInstructions.style.opacity = '1'
    })
}

//Settings Menu Event Listeners

closeButton.addEventListener('click', function() {
    settingsMenu.style.display = 'none';
})

fireCheckbox.addEventListener('click', function() {
    if (fireCheckbox.checked == true) {
        fleetFirepower = true;
    } else { 
        fleetFirepower = false;
    }
    gameReset()
    console.log(fleetFirepower)
})

easyButton.addEventListener('mouseenter', function() {
    difDescription.innerText = "The enemy isn't very thorough when searching your field and isn't as accurate. Your cannoneers rarely miss. This will be a cakewalk";
})
easyButton.addEventListener('mouseleave', function() {
    difDescription.innerText = null;
})
easyButton.addEventListener('click', function() {
    easyButton.style.borderColor = 'rgb(0, 115, 255)';
    normalButton.style.borderColor = "";
    hardButton.style.borderColor = "";
    gameReset()
    enemyHitPercent = .65;
    computerSearchMax = 6;
    playerHitPercent = .90;
})
normalButton.addEventListener('mouseenter', function() {
    difDescription.innerText = "The enemy is thorough when searching for your boats, but your cannoneers still have a slight edge in accuracy. A winnable challenge.";
})
normalButton.addEventListener('mouseleave', function() {
    difDescription.innerText = null;
})
normalButton.addEventListener('click', function() {
    normalButton.style.borderColor = 'rgb(0, 115, 255)';
    easyButton.style.borderColor = "";
    hardButton.style.borderColor = "";
    gameReset()
    enemyHitPercent = .75;
    computerSearchMax = 12;
    playerHitPercent = .83;
})
hardButton.addEventListener('mouseenter', function() {
    difDescription.innerText = "The enemy is ruthlessly efficient at finding your boats and their hardened cannoneers rarely miss. Your cannoneers are less accurate in the face of such a foe. You'll need a lot of luck to win this battle.";
})
hardButton.addEventListener('mouseleave', function() {
    difDescription.innerText = null;
})
hardButton.addEventListener('click', function() {
    hardButton.style.borderColor = 'rgb(0, 115, 255)';
    easyButton.style.borderColor = "";
    normalButton.style.borderColor = "";
    gameReset()
    enemyHitPercent = .90;
    computerSearchMax = 25;
    playerHitPercent = .75;
})


//"Start Game" Logic
function addStartButtonListener() {
    startGameButton.addEventListener('click', function () {
        startGame();
        selectInstructions.style = 'opacity: 1';
    });
}

function recreateStartButton() {
    let newButton = document.createElement('button')
    newButton.id = 'startGame'
    newButton.innerText = 'Start'
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
    // selectEnemyBoats()
    selectPhase = true;
}