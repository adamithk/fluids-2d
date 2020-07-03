import SlabopBase from './slabopbase';

var Splat = (function() {
    "use strict";

    Splat = function(fs, grid, radius) {
        this.grid = grid;
        this.radius = radius === undefined ? 2.0 : radius;

        this.uniforms = {
            read: {
                type: "t"
            },
            gridSize: {
                type: "v2"
            },
            color: {
                type: "v3"
            },
            point: {
                type: "v2"
            },
            radius: {
                type: "f"
            }
        };

        SlabopBase.call(this, fs, this.uniforms, grid);
    };

    Splat.prototype = Object.create(SlabopBase.prototype);
    Splat.prototype.constructor = Splat;

    Splat.prototype.compute = function(renderer, input, color, point, output) {
        this.uniforms.gridSize.value = this.grid.size;
        this.uniforms.read.value = input.read;
        this.uniforms.color.value = color;
        this.uniforms.point.value = point;
        this.uniforms.radius.value = this.radius;

        renderer.render(this.scene, this.camera, output.write, false);
        output.swap();
    };
    return Splat;
}());

export default Splat;
