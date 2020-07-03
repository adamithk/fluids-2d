import * as THREE from "three-legacy"; 

var Display = (function() {
    Display = function(vs, fs, bias, scale) {
        this.bias = bias === undefined ? new THREE.Vector3(0, 0, 0) : bias;
        this.scale = scale === undefined ? new THREE.Vector3(1, 1, 1) : scale;

        this.uniforms = {
            read: {
                type: "t"
            },
            bias: {
                type: "v3"
            },
            scale: {
                type: "v3"
            }
        };
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vs,
            fragmentShader: fs,
            depthWrite: false,
            depthTest: false,
            blending: THREE.NoBlending
        });
        var quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.material);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.scene.add(quad);
    };

    Display.prototype = {
        constructor: Display,

        // set bias and scale for including range of negative values
        scaleNegative: function() {
            var v = 0.2;
            this.bias.set(v, v, v);
            this.scale.set(v, v, v);
        },

        render: function(renderer, read) {
            this.uniforms.read.value = read;
            this.uniforms.bias.value = this.bias;
            this.uniforms.scale.value = this.scale;
            renderer.render(this.scene, this.camera);
        }
    };

    return Display;

}());

export default Display;
