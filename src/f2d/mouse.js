import * as THREE from "three-legacy"; 

var Mouse = (function() {
    
    Mouse = function(grid, container) {
        this.grid = grid;
        this.container = container;

        this.left = true;
        this.right = true;
        this.position = new THREE.Vector2();
        this.motions = [];

        //document.addEventListener("mousedown", this.mouseDown.bind(this), false);
        //document.addEventListener("mouseup", this.mouseUp.bind(this), false);
        document.addEventListener("mousemove", this.mouseMove.bind(this), false);
    };

    Mouse.prototype = {
        constructor: Mouse,

        mouseDown: function(event) {
            this.position.set(event.clientX, this.calculateTop(event));
            this.left = true
            this.right = true
        },

        mouseUp: function(event) {
            //event.preventDefault();
            this.left = false;
            this.right = false;
        },

        mouseMove: function(event) {
            //event.preventDefault();
            
            var r = this.grid.scale;

            var x = event.clientX;
            var y = this.calculateTop(event);

            if (this.left || this.right) {
                var dx = x - this.position.x;
                var dy = y - this.position.y;

                var drag = {
                    x: Math.min(Math.max(dx, -r), r),
                    y: Math.min(Math.max(dy, -r), r)
                };

                var position = {
                    x: x,
                    y: y
                };

                this.motions.push({
                    left: this.left,
                    right: this.right,
                    drag: drag,
                    position: position
                });
            }

            this.position.set(x, y);
        },

        calculateTop: function(event) {
            return event.clientY - this.container.getBoundingClientRect().top;
        }

    };

    return Mouse;

}());

export default Mouse;
