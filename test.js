function testRot ()
{
    var v = new vec3();
    v.x = 1;
    v.y = 0;
    v.z = 0;
    var rotMat = mat3.getRotationMatrix(0.5235987755983, v);
    return rotMat;
}

function testM4Mult()
{
    var i = mat4.identity();
    var m = new mat4();
    m.set(1,1,1,1,
          2,2,2,2,
          3,3,3,3,
          4,4,4,4);
    return m.multiply4m(i);
}