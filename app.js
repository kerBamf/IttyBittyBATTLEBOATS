//Event listener to be added to all tiles
// let tile = 'placeholder'

// tile.addEventListener('click', function () {
//     let y = 

const allTiles = document.querySelectorAll('.tile')
const enRows = document.querySelectorAll('.enRow')
const playRows = document.querySelectorAll('.playRow')
let enGridArray = [];
let playGridArray = [];

//Building Class for tiles. Each tile will have boat stats, but boat presence will be toggled true or false at the beginning of the game

class TileStats {
    constructor() {
        this.boatPresent = false;
        this.health = 3;
        this.sighted = false;
    }
}

//Building Boat Arrays
function buildTileArray() {
    for(let i = 0; i < enRows.length; i++) {
        let newRowArray = [];
        for(let j = 0; j < enRows[i].children.length; j++) {
             let newTile = new TileStats()
            newRowArray.push(newTile)
        }
        enGridArray.push(newRowArray)
        playGridArray.push(newRowArray)
    }
}

buildTileArray()

//Functions adding event listeners to each of the tiles. Tiles can return coordinates based on 'i' and 'j.'
function playTileListenerApplier() {

    for(let i = 0; i < playRows.length; i++) {
        let tiles = playRows[i].children;
        for (let j = 0; j < tiles.length; j++) {
            tiles[j].addEventListener('click', function() {
                
            })
        }
    }
}

function enTileListenerApplier() {

    for(let i = 0; i < enRows.length; i++) {
        let tiles = enRows[i].children;
        for (let j = 0; j < tiles.length; j++) {
            tiles[j].addEventListener('click', function() {
                
            })
        }
    }
}

enTileListenerApplier();
playTileListenerApplier()