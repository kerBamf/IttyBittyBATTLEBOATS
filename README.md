ITTY BITTY BATTLE BOATS!!!

## User Story

In this game, the user will being playing a modified game of battleship. There will be two grids, side-by-side, a player grid and an enemy grid. At the beginning of the game, the user will choose a set number of tiles to place their battle boats. The computer will do the same thing. When play begins, whoever gets to go first will be chosen at random. Both the computer and the player will have one 'action' per turn, either "sighting" or "firing." The player "sights" by clicking on a blank tile on the enemy grid. If there is no boat on that tile, the tile will remain unmarked. This is adding a memory aspect to the game, though this could be changed based on how gameplay feels. If a player clicks on a tile occupied by a boat, the boat will be "sighted," with the tile changing color (or some other effect) as an indicator. On their next turn, the player can choose to attempt to "sight" another enemy boat or "fire" on an enemy boat by clicking on an occupied tile. A boat must be "fired" upon until its HP runs out (value could be changed if the game takes too long.) Once either all of the computer's boats or all of the player's boats are sunk, the game is over. Some text will appear on the screen proclaiming the winner, and a button will appear asking if the user would like to play again.

## User-experience stretch features:

    Scoreboard for victories/losses

    When first loading the game, a timed 'splash page' will flash the name of the game before revealing the full UI

    When 'sighting,' add a fadeout effect to the tile the player clicks on

## Stretch Game Mechanics:
    
    Fleet Firepower: If the player (and computer) have all of their boats remaining, each "fire" action deals double damage. IMPLEMENTED

    Custom Grid Sizing: Player will be able to customize the size of the battle grids

    Custom boat numbers: Player will be able to choose the number of boats


## Pseudocode

DOMobjectvariables
necessaryGlobalVariables
gameStateVariables
playerGridArray
enemyGridArray

objectClass {
    class used for boat-stat object generator
}

buildTileArray {
    function to build tile object arrays using previously defined class. Ranges defined by loop iterator values given when looping through HTML DOM objects.  i indicates row value, j indicates tile value within the row. Since this is derived from the already existing HTML elements, it will always create the proper sized array.
}


Play/EnemyTileListeners {
    Function applying event listeners to all of the tiles. i indicates row value, j indicates tile value within the row. 'Click' function will then call various other functions based on 'game-state' toggles. 'MouseOver' function behavior will be based on status of the associated object. 'Click' Example:
    addEventListener('click', funtion () {    
        if (playerTurn == true) {
            playerOffensive();
        }
    }
}


playerOffensive() {
    Function defining how enemy tile objects are affected during player action. Finishes by changing 'game-state' turn variable to computer turn.
}

computerHunterKillerLogic() {
    Function defining computer logic, based on Hunter/Killer game-state toggle. In 'hunter' mode, the computer will check a random tile object (using previously defined player tile object array). If the tile object does not have a boat (set earlier by player selection), a "the computer missed" indicator will be displayed, a 'tile-checked' property will be applied in the object, and the turn will end. If the computer selects a tile it has already checked, this function will call itself again (hopefully this won't be game-breaking recursion). If a boat is present, the computer 'game-state' will switch to 'Killer' mode. On each subsequent turn the computer will 'fire' on that boat until it is sunk. Once sunk, the 'tile-checked' property will applied, and the 'game-state' toggle will switch back to 'hunter' mode.
}

More function declarations to follow applying graphics based on game-state variable toggles and object properties. Functions will change variables as needed to properly reflect changes based on play.