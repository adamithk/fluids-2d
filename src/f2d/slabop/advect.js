import SlabopBase from './slabopbase';

var Advect = (function() {
    "use strict";

    Advect = function(fs, grid, time, dissipation) {
        this.grid = grid;
        this.time = time;
        this.dissipation = dissipation === undefined ? 0.998 : dissipation;

        this.uniforms = {
            velocity: {
                type: "t"
            },
            advected: {
                type: "t"
            },
            gridSize: {
                type: "v2"
            },
            gridScale: {
                type: "f"
            },
            timestep: {
                type: "f"
            },
            dissipation: {
                type: "f"
            }
        };

        SlabopBase.call(this, fs, this.uniforms, grid);
    };

    Advect.prototype = Object.create(SlabopBase.prototype);
    Advect.prototype.constructor = Advect;

    Advect.prototype.compute = function(renderer, velocity, advected, output) {
        this.uniforms.velocity.value = velocity.read;
        this.uniforms.advected.value = advected.read;
        this.uniforms.gridSize.value = this.grid.size;
        this.uniforms.gridScale.value = this.grid.scale;
        this.uniforms.timestep.value = this.time.step;
        this.uniforms.dissipation.value = this.dissipation;
        renderer.render(this.scene, this.camera, output.write, false);
        output.swap();
    };

    return Advect;

}());

export default Advect;
