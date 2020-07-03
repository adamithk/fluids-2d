import SlabopBase from './slabopbase';

var Vorticity = (function() {
    "use strict";

    Vorticity = function(fs, grid) {
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

    Vorticity.prototype = Object.create(SlabopBase.prototype);
    Vorticity.prototype.constructor = Vorticity;

    Vorticity.prototype.compute = function(renderer, velocity, output) {
        this.uniforms.velocity.value = velocity.read;
        this.uniforms.gridSize.value = this.grid.size;
        this.uniforms.gridScale.value = this.grid.scale;

        renderer.render(this.scene, this.camera, output.write, false);
        output.swap();
    };

    return Vorticity;

}());

export default Vorticity;
