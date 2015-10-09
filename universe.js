var canvas = document.getElementById('universe-map');
var width = canvas.width;
var height = canvas.height;
var gl = createContext(canvas);

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.frontFace(gl.CCW);
gl.disable(gl.CULL_FACE);

var eye = new vec3();
eye.set(0, 0, -1.0);
var centre = new vec3();
centre.set(0, 0, 0);
var up = new vec3();
up.set(0, 1.0, 0);

var view = mat4.getViewMatrix(eye, up, centre);
var projection = mat4.getProjectionMatrix(90, width/height, 1, 1000);
var model = mat4.identity();

var rotationAxis = new vec3();
rotationAxis.set(1.0, 0.0, 0.0);

//model = mat4.getRotationMatrix(Math.PI/4, rotationAxis).multiply4m(model);

var meshes = [];
var quadMesh = new mesh('meshes/quad-3d.mesh', model, view, projection);
meshes.push(quadMesh);
var offsetQuadMesh = new mesh('meshes/offset-quad.mesh');
meshes.push(offsetQuadMesh);


function draw() {
	for (var m in meshes) {
		var mesh = meshes[m];
		mesh.draw(); // Refactor to use scene graph
	}
}

var start = null;
var running = true;

function step(timestamp) {
    if (!start) 
    {
        start = timestamp;
    }
    var progress = timestamp - start;
    
    draw();
    if (running)
    {
        window.requestAnimationFrame(step);
    }
}

(function init () {
	// Create scene graph

	// Start draw loop
    draw();
    //window.requestAnimationFrame(step);
})();