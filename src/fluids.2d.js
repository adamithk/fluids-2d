import * as THREE from "three-legacy"; 
import Mouse from './f2d/mouse';
import Solver from './f2d/solver';
import Display from './f2d/display';
import {
    AdvectShader,
    BasicShader,
    BoundaryShader,
    DisplayScalarShader,
    DisplayVectorShader,
    DivergenceShader,
    GradientShader,
    JacobiScalarShader,
    JacobiVectorShader,
    SplatShader,
    VorticityShader,
    VorticityForceShader
} from './shaders.js';

class Fluids2d {

    constructor(container,slabType) {
        this.container = container;
        this.solver = null; 
        this.displayScalar = null;
        this.displayVector = null;

        this.windowSize = new THREE.Vector2(container.clientWidth, container.clientHeight);
        this.time = {
            step: 1,
        };

        this.grid = {
            size: new THREE.Vector2(512, 256),
            scale: 1,
            applyBoundaries: true
        };

        this.displaySettings = {
            slab: slabType
        };

        this.mouse = new Mouse(this.grid, this.container);
        console.log(this.windowSize);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
        this.renderer.sortObjects = false;
        this.renderer.setSize(this.windowSize.x, this.windowSize.y);
        this.renderer.setClearColor(0x00ff00);
        this.renderer.domElement.style.position = "relative";
        this.renderer.domElement.style.top = "0";
        this.renderer.domElement.style.left = "0";
        this.renderer.domElement.style.right = "0";
        this.renderer.domElement.style.bottom = "0";
        this.renderer.domElement.style.zIndex = "0";
        container.appendChild(this.renderer.domElement);


        

        this.update = this.update.bind(this);
        this.resize = this.resize.bind(this);
        window.addEventListener("resize", this.resize);

        const shaders = {
            advect: AdvectShader,
            basic: BasicShader,
            boundary: BoundaryShader,
            displayscalar: DisplayScalarShader,
            displayvector: DisplayVectorShader,
            divergence: DivergenceShader,
            gradient: GradientShader,
            jacobiscalar: JacobiScalarShader,
            jacobivector: JacobiVectorShader,
            splat: SplatShader,
            vorticity: VorticityShader,
            vorticityforce: VorticityForceShader
        }

        this.init(shaders);

    }

    init(shaders) {
        this.solver = Solver.make(this.grid, this.time, this.windowSize, shaders);

        this.solver.ink.set(8 / 255, 8 / 255, 8 / 255);
        
        this.displayScalar = new Display(shaders.basic, shaders.displayscalar);
        this.displayVector = new Display(shaders.basic, shaders.displayvector);
        requestAnimationFrame(this.update);
    }

    update() {
        if(this.renderer) {
            this.solver.step(this.renderer, this.mouse);
            this.render();
            requestAnimationFrame(this.update);
        }
    }

    render() {
        var display, read;
        switch (this.displaySettings.slab) {
        case "velocity":
            display = this.displayVector;
            display.scaleNegative();
            read = this.solver.velocity.read; 
            break;
        case "density":
            console.log("")
            display = this.displayScalar;
            display.scale.copy(this.solver.ink);
            display.bias.set(0, 0, 0);
            read = this.solver.density.read;
            break;
        case "divergence":
            display = this.displayScalar;
            display.scaleNegative();
            read = this.solver.velocityDivergence.read;
            break;
        case "pressure":
            display = this.displayScalar;
            display.scaleNegative();
            read = this.solver.pressure.read;
            break;
        }
        display.render(this.renderer, read);
    }

    resize(){
        this.windowSize.set(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setSize(this.windowSize.x, this.windowSize.y);
    }

    destroy() {
        this.container.removeChild(this.renderer.domElement);
        this.renderer = null;
        window.removeEventListener("resize", this.resize);
    }

}

export default Fluids2d;