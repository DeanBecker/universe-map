var canvas = document.getElementById('universe-map');
var gl = createContext(canvas);

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

var meshes = [];
var quadMesh = new mesh('meshes/quad.mesh');
meshes.push(quadMesh);
var offsetQuadMesh = new mesh('meshes/offset-quad.mesh');
meshes.push(offsetQuadMesh);

function draw() {
	for (var m in meshes) {
		var m = meshes[m];
		m.draw(); // Refactor to use scene graph
	}
}

function init () {
	// Create scene graph

	// Start draw loop
}

init();