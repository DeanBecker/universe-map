window.onerror = function (msg, url, lineno) {
	console.log(url + '/' + lineno + ': ' + msg);
}

function createContext (canvas) {
	var gl = canvas.getContext('experimental-webgl');
	return gl;
}

function createShader (str, type) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw gl.getShaderInfoLog(shader);
	}
	return shader;
}

function createProgram (vertexShaderPath, fragmentShaderPath, callback) {
	var program = gl.createProgram();
	var vertexShader = '';
	var fragmentShader = '';

	function onvertexshaderload (str) {
		vertexShader = str;
		checkStatus();
	}

	function onfragmentshaderload (str) {
		fragmentShader = str;
		checkStatus();
	}

	function checkStatus () {
		if (vertexShader != '' && fragmentShader != '') {
			finaliseProgram();
		}
	}

	loadFile(vertexShaderPath, onvertexshaderload, false);
	loadFile(fragmentShaderPath, onfragmentshaderload, false);

	function finaliseProgram () {
		var vert = createShader(vertexShader, gl.VERTEX_SHADER);
		var frag = createShader(fragmentShader, gl.FRAGMENT_SHADER);
		gl.attachShader(program, vert);
		gl.attachShader(program, frag);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(program);
		}

		callback(program);
	}

	return program;
}

function loadFile (file, callback, isJson) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 1) {
			if (isJson) {
				req.overrideMimeType('application/json');
			}
			req.send();
		} else if (req.readyState == 4) {
			if (req.status == 200) {
				callback(req.responseText);
			} else {
				throw req.status;
			}
		}
	};

	req.open('GET', file, true);
}

function bufferQuad () {
    // Test function
	var vertexPosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
	var vertices = [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vertexPosBuffer.itemSize = 2;
	vertexPosBuffer.itemCount = vertices.length / vertexPosBuffer.itemSize;
	return vertexPosBuffer;
}