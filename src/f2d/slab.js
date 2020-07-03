import * as THREE from "three-legacy"; 

var Slab = (function() {
    "use strict";

    Slab = function(width, height, options) {
        this.read = new THREE.WebGLRenderTarget(width, height, options);
        this.write = this.read.clone();
    };

    Slab.prototype = {
        constructor: Slab,

        swap: function() {
            var tmp = this.read;
            this.read = this.write;
            this.write = tmp;
        }
    };

    var options = {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthBuffer: false,
        stencilBuffer: false,
        generateMipmaps: false,
        shareDepthFrom: null
    };

    Slab.make = function(width, height) {
        return new Slab(width, height, options);
    };

    return Slab;

}());

export default Slab;