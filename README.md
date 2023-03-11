ITTY BITTY BATTLE BOATS!!!

## User Story

In Itty Bitty BATTLE BOATS, the player is playing a spin on the game Battleship. To play, players press the "Start" button, and are prompted to click on their own grid to select where to place their boats. Upon clicking, a little boat image is placed on the selected tile. Once their 8 boats are placed, the player is prompted to click on the enemy grid to search for and attack enemy boats. When the player clicks on a tile with an enemy boat on it, the enemy boat is "Sighted," an enemy boat image appears on the tile, and clicking on that tile again will deal damage to the enemy boat. Each boat has 3 health; after 3 hits, the boat will explode and the image is replaced by a cat in a life-preserver. Once all of the player or computer boats are sunk, a popup appears indicating player victory or defeat, and the player will have the choice of playing again or leaving the game in its current state. If the player selects "Leave Me," the page will need to be refreshed or they will need to change the settings before playing again

## Current Stretch-Features

In-Game Reset: Rather than needing to refresh the page to play again, there are built-in reset mechanics, allowing for smoother gameplay transitions.

Graphics: I made the cat and wave images myself, and added them to the gameplay, rather than simply changing tile colors as indicators.

Fleet Firepower: Added a feature where the attacker (player or computer) deals double-damage until two of their boats are sunk.

 Difficulty: Added modifiers to the player and computer attack mechanics, adjusting "Accuracy" of attacks, adding more random chance to the game

Custom Grid Sizing: Players can change the size of the grid

Settings Menu: Fleet firepower, difficulty, and grid-size can be selected via a settings menu. The settings menu disables event listeners while open, preventing the continuation of gameplay behind the menu itself. If any of the settings are changed, the game automatically resets both to ensure there are no errors and to keep the player from "gaming" the system in terms of difficulty.


## Future Stretch Features
    
Scoreboard: Will show player victories and losses until the page is refreshed or the user changes any of the settings

Custom Boat Count: The user will be able to select the number of boats in play

Mobile formatting: The game is currently unplayable on mobile devices due to CSS; dynamic styiling will be added to address that issue

 Intro animation: Show a simple animation when the page is first loaded

New "Leave Me" graphic: Will add an image of a sunset with one of the cat-boats should the player choose "Leave Me" at the end of a game.

## Dificulties
    
Styling: Getting CSS to behave the way I wanted was one of the biggest difficulties. I discovered a bug in CSS in relation to border behavior in the DOM.

Also, I noticed the CSS behaved differently when the grids were dynamically built in JS compared to when they were hard-coded in HTML, even when all of their class and id tags in CSS were identical.

Listeners: Getting grid HTML elements to associate properly with JS variables and objects was the biggest hurdle in getting the core mechanics to work. Once that was finished being built, the rest of the mechanics came easily.


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
    })
}


playerOffensive() {
    
Function defining how enemy tile objects are affected during player action. Finishes by changing 'game-state' turn variable to computer turn.

}

computerHunterKillerLogic() {

Function defining computer logic, based on Hunter/Killer game-state toggle. In 'hunter' mode, the computer will check a random tile object (using previously defined player tile object array). If the tile object does not have a boat (set earlier by player selection), a "the computer missed" indicator will be displayed, a 'tile-checked' property will be applied in the object, and the turn will end. If the computer selects a tile it has already checked, this function will call itself again (hopefully this won't be game-breaking recursion). If a boat is present, the computer 'game-state' will switch to 'Killer' mode. On each subsequent turn the computer will 'fire' on that boat until it is sunk. Once sunk, the 'tile-checked' property will applied, and the 'game-state' toggle will switch back to 'hunter' mode.

}

More function declarations to follow applying graphics based on game-state variable toggles and object properties. Functions will change variables as needed to properly reflect changes based on play.