import SlabopBase from './slabopbase';

var Gradient = (function() {
    "use strict";

    Gradient = function(fs, grid) {
        this.grid = grid;

        this.uniforms = {
            p: {
                type: "t"
            },
            w: {
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

    Gradient.prototype = Object.create(SlabopBase.prototype);
    Gradient.prototype.constructor = Gradient;

    Gradient.prototype.compute = function(renderer, p, w, output) {
        this.uniforms.p.value = p.read;
        this.uniforms.w.value = w.read;
        this.uniforms.gridSize.value = this.grid.size;
        this.uniforms.gridScale.value = this.grid.scale;

        renderer.render(this.scene, this.camera, output.write, false);
        output.swap();
    };

    return Gradient;

}());

export default Gradient;
