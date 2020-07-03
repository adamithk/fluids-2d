import * as THREE from "three-legacy";  
import SlabopBase from './slabopbase';

var VorticityConfinement = (function() {
    "use strict";

    VorticityConfinement = function(fs, grid, time, epsilon, curl) {
        this.grid = grid;
        this.time = time;
        this.epsilon = epsilon === undefined ? 2.4414e-4 : epsilon;
        this.curl = curl === undefined ? 0.3 : curl;

        this.uniforms = {
            velocity: {
                type: "t"
            },
            vorticity: {
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
            epsilon: {
                type: "f"
            },
            curl: {
                type: "v2",
                value: new THREE.Vector2()
            },
        };

        SlabopBase.call(this, fs, this.uniforms, grid);
    };

    VorticityConfinement.prototype = Object.create(SlabopBase.prototype);
    VorticityConfinement.prototype.constructor = VorticityConfinement;

    VorticityConfinement.prototype.compute = function(renderer, velocity, vorticity, output) {
        this.uniforms.velocity.value = velocity.read;
        this.uniforms.vorticity.value = vorticity.read;
        this.uniforms.gridSize.value = this.grid.size;
        this.uniforms.gridScale.value = this.grid.scale;
        this.uniforms.timestep.value = this.time.step;
        this.uniforms.epsilon.value = this.epsilon;
        this.uniforms.curl.value.set(
            this.curl * this.grid.scale,
            this.curl * this.grid.scale
        );

        renderer.render(this.scene, this.camera, output.write, false);
        output.swap();
    };

    return VorticityConfinement;

}());

export default VorticityConfinement;
