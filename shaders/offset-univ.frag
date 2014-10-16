precision mediump float;
varying vec2 vPos;
void main() { 
	vec3 _col = vec3(vPos.x, vPos.y, 0.2);
	gl_FragColor = vec4(_col, 1.0); 
}