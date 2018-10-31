function testView(eye, centre, up) {
    var a = new THREE.Vector3();
    a.subVectors(eye, centre);
    var w = new THREE.Vector3();
    w.copy(a);
    w.divideScalar(a.length());
    var u = new THREE.Vector3();
    u.crossVectors(up, w);
    u.divideScalar(u.length());
    var v = new THREE.Vector3();
    v.crossVectors(w, u);
    
    var mat = new THREE.Matrix4();
    mat.set(u.x, u.y, u.z, ((-u.x*eye.x)*(-u.y*eye.y)*(-u.z*eye.z)),
        v.x, v.y, v.z, ((-v.x*eye.x)*(-v.y*eye.y)*(-v.z*eye.z)),
        w.x, w.y, w.z, ((-w.x*eye.x)*(-w.y*eye.y)*(-w.z*eye.z)),
        0, 0, 0, 1.0);

    return mat;
}

var eye = new THREE.Vector3(0, 0, -1.0);
var centre = new THREE.Vector3(0, 0, 0);
var up = new THREE.Vector3(0, 1.0, 0);

var myView = testView(eye, centre, up);

var threeView = new THREE.Matrix4();
threeView.lookAt(eye, centre, up);

// console.log(myView);
// console.log(threeView);

function testPersp(fov, aspect, zNear, zFar) {
    var fovRadians = fov*(Math.PI/180);
    var theta = fovRadians/2.0;
    var d = 1.0 / Math.tan(theta);
    var A = -((zFar+zNear)/(zFar-zNear));
    var B = -((2*zFar*zNear)/(zFar-zNear));
    var dOVerAspect = d / aspect;
    
    var mat = new THREE.Matrix4();
    mat.set(dOVerAspect,0,0,0,
            0,d,0,0,
            0,0,A,B,
            0,0,-1.0,0);
    return mat;
}

var myPersp = testPersp(75, 800/600, 1, 1000);

var threePersp = new THREE.Matrix4();
threePersp.makePerspective(75, 800/600, 1, 1000);

// console.log(myPersp);
// console.log(threePersp);
