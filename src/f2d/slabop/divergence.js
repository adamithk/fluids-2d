import SlabopBase from './slabopbase';

var Divergence = (function() {
    "use strict";

    Divergence = function(fs, grid) {
        this.grid = grid;

        this.uniforms = {
            velocity: {
                type: "t"
            },
            gridSize: {
                type: "v2"
            },
            gridScale: {
                type: "f"
            },
        };

        SlabopBase.call(this, fs, this.uniforms, grid);
    };

    Divergence.prototype = Object.create(SlabopBase.prototype);
    Divergence.prototype.constructor = Divergence;

    Divergence.prototype.compute = function(renderer, velocity, divergence) {
        this.uniforms.velocity.value = velocity.read;
        this.uniforms.gridSize.value = this.grid.size;
        this.uniforms.gridScale.value = this.grid.scale;

        renderer.render(this.scene, this.camera, divergence.write, false);
        divergence.swap();
    };


    return Divergence;

}());

export default Divergence;
