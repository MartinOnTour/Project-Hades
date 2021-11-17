/**
 * Rounds aValue to a certain degree of Accuracy e.g. 
 * aValue = 8, aNormalizer = 10 => return 0. 
 * aValue = 18, aNormalizer = 10 => return 10.
 * aValue = 101, aNormalizer = 100 => return 100. 
 */
function normalize(aValue, aNormalizer) {
    return aValue - (aValue % aNormalizer);
}


/**
 * Utility-Class to Translate Array Indexes to drawable rectabgles on a Canvas.
 */
class Index {
    constructor(args) {
        if (args.width) {
            this.x = args.x / args.width;
            this.y = args.y / args.width;
        } else {
            this.x = args.x;
            this.y = args.y;
        } 
    }
}

/**
 * Utility-Class to Translate Array Indexes to drawable rectangles on a Canvas.
 */
class Rect {

    constructor(args) {
        if (args.x && args.y && args.width) {
            if (args.norm) {
                this.x = normalize(args.x, args.norm);
                this.y = normalize(args.y, args.norm);
            } else {
                this.x = args.x;
                this.y = args.y;
            }
            this.width = args.width;
        } else {
            if (args.index && args.width) {
                this.x = args.index.x * args.width;
                this.y = args.index.y * args.width;
                this.width = args.width;
            }
        }
    }

    getIndex() {
        return new Index({
            x: this.x / this.width, 
            y : this.y / this.width})
    }
}

/**
 * Class which divides a drawable Canvasarea into a 2D grid(like a Chessboard), and offers Utilty function to Interact with it and the created sqaures.
 * The Sqaure with [0][0] Index designation is always in the upper left corner.
 */
class Grid {

    LineColor = 'darkgrey';
    defaultFieldColor = 'lightgrey';

    /**
     * @param {Canvas} aCanvas - Canvas with which this Class interacts. 
     * @param {number} aFieldWidth - Width of each Sqaure which is to be created/drawn on the Canvas. Also Determins the Amount of Fields in the Canvas depending on the drawable Areasize.
     */
    constructor(aCanvas, aFieldWidth) {
        this.canvas = aCanvas;
        this.canvas.width = normalize(aCanvas.width, aFieldWidth);
        this.canvas.height = normalize(aCanvas.height, aFieldWidth);
        this.fieldWidth = aFieldWidth;
        this.context = this.canvas.getContext("2d");
    }

    /**
     * Clears everything which is drawn on the Canvas
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Translates a given Index into a Rect which occupies its place.
     * @param {Index} aIndex - Index  
     * @returns Rect which occupies this Index. 
     */
    getRectByIndex(aIndex) {
        return new Rect({index : aIndex, width : this.fieldWidth});
    }

    /**
     * Transforms given Coordinates in the Canvas into a Rect which occupies these Coordinates. 
     * @param {number} x X-Coordinates in the Canvas
     * @param {number} y >-Coordinate in the Canvas 
     * @returns Rect wicht occupies the Coordinate.
     */
    getRectByPos(x, y) {
        return new Rect({x: x, y :y, width: this.fieldWidth, norm : this.fieldWidth});
    }

    /**
     * Transforms a given Rect inside the Canvas Area into a corresponding Array Index.
     * @param {Rect} rect Rect to which an Index in requested
     * @returns Index of the Rect inside the Canvas Array. 
     */
    getIndexByRect(rect) {
        return new Index({rect});
    }

    /**
     * Transforms given Coordinates in the Canvas into Array Indixes
     * @param {number} x X-Coordinate in the Canvas
     * @param {number} y Y-Coordinate in the Canvas
     * @returns Index of the Rect which occupies the Coordinate.
     */
    getIndexByPos(x, y) {
        return new Rect({x: x,y: y, width: this.fieldWidth, norm: this.fieldWidth}).getIndex();
    }
  
    /**
     * @returns The amount of possible Fields in the Canvas
     */
    getFieldCount() {
        return this.canvas.width / this.fieldWidth;
    }
    
    /**
     * Draws the grid-lines on the Canvas. Fieldwidth determines the distance between gridlines.
     */
    drawGridLines(){
        let w = this.canvas.width;
    
        this.context.beginPath();
        for (let x = 0; x <= w; x += this.fieldWidth) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, w);
        }

        this.context.strokeStyle = this.LineColor;
        this.context.lineWidth = 1;    
        this.context.stroke();
    
    
        this.context.beginPath();
        for (let y = 0; y <= w; y += this.fieldWidth) {
            this.context.moveTo(0, y);
            this.context.lineTo(w, y);
        }

        this.context.strokeStyle = this.LineColor;
        this.context.lineWidth = 1;
        this.context.stroke();    
    }

    /**
     * Draws each field of an 2D Array as a Rectangle on the Canvas. 
     * Each Index determins its unique place on the Canvas, depending on this.fieldWidth.
     * Also redraws the Gridlines.
     * @param {Array(number)} Arr- 2D Array containing Values, which determin what is to be drawn on the Canvas
     * @param {function(State)} func- Callback function which determines which color is to be drawn.
     */
    drawRectByArray(arr, func) {
        // Zeichne jedes Rechteck
        for (let x = 0; x < arr.length; x++) {
            for (let y = 0; y < arr[x].length; y++) {
                this.drawRect(this.getRectByIndex(new Index({x, y})), arr[x][y], func);               
            }
        }

        this.drawGridLines();
    }

    /**
     * Draws a Rectangle on the Canvas.
     * @param {Rect} aRect - Coordinates for the rectange on the canvas.
     * @param {number} func - Function which decided which color is to be drawn
     */
    drawRect(aRect, aState, func) {
        let color = func(aState);

        this.context.fillStyle = color;

        this.context.fillRect(aRect.x, aRect.y, aRect.width, aRect.width);        
    }
}
