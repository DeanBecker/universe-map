attribute vec4 vertPos;
varying vec4 vPos;

uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projMat;

void main() {
	gl_Position = projMat * viewMat * modelMat * vertPos;
    vPos = vertPos;
}