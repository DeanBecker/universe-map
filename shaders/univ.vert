attribute vec2 vertPos;
varying vec2 vPos;

void main() {
	gl_Position = vec4(vertPos, 0, 1);
    vPos = vertPos;
}