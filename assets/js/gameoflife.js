/**
 * All allowed states for the Game of Life.
 */
const State = {
    dead : 0,
    alive : 1,

    /**
     * Returns the corresponding color for a certain state(dead|alive).
     * @param {State} aState - accepts a state dead|alive.
     * @returns - color which corresponds to this state.
     */
    colorCode(aState){
        switch (aState) {
            case State.dead: return 'lightgrey';            
            case State.alive: return 'white';
            default: return 'red'
        }
    }
}

/**
 * Instance to caluculate the next states for a Game of Life 
 * Currently Supports only a Sqaure playing field.
 */
class GameOfLife {

    ended = false;

    // Tupel for Index Neigbours which need to be checked for their state.
    posTupel = [
        [-1, -1],
        [-1,  0],
        [-1,  1],
        [ 0, -1],
        [ 0,  1],
        [ 1, -1],
        [ 1,  0],
        [ 1,  1],
    ];

    /**
     * Create an instance of the Game of Life on a Quadratic 2D Array.
     * @param {number} dim - width of the Quadratic 2D Array.
     */
    constructor (dim) {
        this.dim = dim;
        this.gameField = this.createFieldsArray(dim);
        this.totalAliveCount = 0;
    }

    /**
     * Calculates the next states for all fields in the gameField Array on which the game is played.
     * @returns - True if at least one field is still State.alive, or this.ended = True.
     */
     calcNextStates() {

        if (this.ended) return false;

        let NextFields = this.createFieldsArray(this.dim, State.dead);
        let aliveCount = 0;
        let aliveNeigbours;

        // Iterate the whole Array
        for (let x = 0; x < this.gameField.length; x++) {
            for (let y = 0; y < this.gameField[x].length; y++) {

                // Count the number of State.alive neighbours
                aliveNeigbours = this.countAliveNeighbours(this.gameField, x, y);

                // depending on the amount of State.alive neighbours change the state of the current field 
                if (this.gameField[x][y] == State.alive) {
                    if (aliveNeigbours < 2) {    
                        NextFields[x][y] = State.dead;  
                    } else if (aliveNeigbours <= 3){
                        NextFields[x][y] = State.alive; 
                        aliveCount++;
                    } else {
                        NextFields[x][y] = State.dead;  
                    }
                } else {
                    if (aliveNeigbours == 3) {
                        NextFields[x][y] = State.alive; 
                        aliveCount++;
                    }
                }                   
            }                
        }

        this.gameField = NextFields;
        this.totalAliveCount = aliveCount;

        // simple test to determin the end of game
        // doesn't detect static games, where the states do not change anymore, but some are still alive
        if (this.totalAliveCount == 0) {
            this.ended = true;
        }        
        return true;
    }    

    /**
     * Count the Number of all alive fields around a certain Field in an Array of States.
     * @param {Array[number]} arr - all States of the game represented as an 2D Array.
     * @param {number} x - X-Coordinate of a certain state in arr.
     * @param {number} y - Ycoordinate of a certain state in arr.
     * @returns 
     */
    countAliveNeighbours(arr, x, y) {
        let count = 0;
        this.posTupel.forEach((offset) => {
            if ((offset[0] + x >= 0) && (offset[0] + x < arr[y].length) &&
                (offset[1] + y >= 0) && (offset[1] + y < arr.length)) {
                
                let val = arr[x + offset[0]][y + offset[1]];
    
                if (val == State.alive) {
                    count++;
                }
            } 
        });
        return count;
    }

    /**
     * Creates a 2D Array dependent aDim with aDefaultState set for every Field.
     * @param {number} aDim - DImension of the quadratic Array.
     * @param {number} aDefaultState - Default state for all fields of the Array. 
     * @returns - An 2D Array field with aDefaultState set for every Field.
     */
     createFieldsArray(aDim, aDefaultState = 0) {
        let arr = new Array(aDim).fill(aDefaultState);

        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(aDim).fill(aDefaultState);    
        }

        return arr;
    }

    reset(){
        this.ended = false;
        this.gameField = this.createFieldsArray(this.dim);
        this.totalAliveCount = 0;
    }
}