function mesh(str, model, view, projection) {
    this.modelMatrix = model;
    this.viewMatrix = view;
    this.projectionMatrix = projection;
	this.meshResource = str;
	this.initialised = false;
	this.programs = [];
	var obj = this;

	this.init = function (rawData) {
		var meshData = JSON.parse(rawData);
		obj.materials = meshData.materials;
		obj.indices = meshData.indices;
		obj.vertices = meshData.vertices;
		obj.vertexPosBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);

		obj.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.indices), gl.STATIC_DRAW);

		for (var m in obj.materials) {
			var material = obj.materials[m];
			var program = createProgram(material.vertex, material.fragment, function(p) {
				p.vertexPosAttrib = gl.getAttribLocation(p, 'vertPos');
                p.modelMatrix = gl.getUniformLocation(p, 'modelMat');
                p.viewMatrix = gl.getUniformLocation(p, 'viewMat');
                p.projectionMatrix = gl.getUniformLocation(p, 'projMat');
				obj.draw(); // draw object after full initialisation
			});
			program.numIndices = material.numIndices;
			obj.programs.push(program);
		}

		obj.initialised = true;
	};

	this.draw = function () {
		var start = 0;
		for (var p in obj.programs) {
			var program = obj.programs[p];
			gl.useProgram(program);
			gl.enableVertexAttribArray(program.vertexPosAttrib);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPosBuffer);
			gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
            
            if (program.modelMatrix && program.viewMatrix && program.projectionMatrix) {
                gl.uniformMatrix4fv(program.modelMatrix, gl.FALSE, this.modelMatrix.data);
                gl.uniformMatrix4fv(program.viewMatrix, gl.FALSE, this.viewMatrix.data);
                gl.uniformMatrix4fv(program.projectionMatrix, gl.FALSE, this.projectionMatrix.data);
            }
            
			gl.drawElements(gl.TRIANGLES, program.numIndices, gl.UNSIGNED_SHORT, start);	
			start += program.numIndices;
		}
	};

	loadFile(obj.meshResource, obj.init, true);
}