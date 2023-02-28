//Event listener to be added to all tiles
// let tile = 'placeholder'

// tile.addEventListener('click', function () {
//     let y = 

const allTiles = document.querySelectorAll('.tile')
const enRows = document.querySelectorAll('.enRow')
const playRows = document.querySelectorAll('.playRow')
let enGridArray = [];
let playGridArray = [];
let computerBrainArray = [];

//Building Class for tiles. Each tile will have boat stats, but boat presence will be toggled true or false at the beginning of the game

class TileStats {
    constructor() {
        this.boatPresent = false;
        this.health = 3;
        this.sighted = false;
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

buildTileArray()

//Player Tile Listeners
function playTileListeners() {

    for(let i = 0; i < playRows.length; i++) {
        let tileArray = playRows[i].children;
        for (let j = 0; j < tiles.length; j++) {
            tileArray[j].addEventListener('click', function() {
                
            })
        }
    }
}

// New Listener currently populated with hit/miss logic, deriving coordinates from iterators. This will allow listeners to be accurately applied regardless of grid size, and will match associated boat-stat array(s) since they both use the same iterators. Later version will execute different functions based on "game-state" variables yet to be coded.
function enTileListeners() {

    for(let i = 0; i < enRows.length; i++) {
        let tiles = enRows[i].children;
        for (let j = 0; j < tiles.length; j++) {
            tiles[j].addEventListener('click', function() {
               let boat = enGridArray[i][j];
               console.log(`Shots fired at ${i}, ${j}`);
               if (boat.boatPresent == true){
                boat.health -= 1;
                console.log(enGridArray[i][j].health)
               } else {
                console.log('Miss')
               }
            })
        }
    }
}

playTileListeners()
enTileListeners()