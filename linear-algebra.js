/*
 * 4x4 Matrix
 */
function mat4()
{
	this.data = new Float32Array(16);
    this.columns = 4;
    this.rows = 4;
}

mat4.identity = function() {
    var identityMatrix = new Float32Array(16);

    for (var i = 0; i < identityMatrix.length; i++)
    {
        if (i==0 || i%5==0)
        {
            identityMatrix[i] = 1.0;
        }
    }
    
    var newMat = new mat4();
    newMat.data = identityMatrix;
    return newMat;
}

mat4.getTranslationMatrix = function (vec) {
    var mat = new mat4();
    
    mat.set(1.0, 0.0, 0.0, vec.x,
           0.0, 1.0, 0.0, vec.y,
           0.0, 0.0, 1.0, vec.z,
           0.0, 0.0, 0.0, 1.0);
    
    return mat;
}

mat4.getScaleMatrix = function (vec) {
    var mat = new mat4();
    
    mat.set(vec.x, 0.0, 0.0, 0.0,
           0.0, vec.y, 0.0, 0.0,
           0.0, 0.0, vec.z, 0.0,
           0.0, 0.0, 0.0, 1.0);
    
    return mat;
}

mat4.getRotationMatrix = function (theta, vector) {
    var rotMat3 = mat3.getRotationMatrix(theta, vector);
    var mat = new mat4();
    
    mat.set(rotMat3.data[0], rotMat3.data[1], rotMat3.data[2], 0.0,
            rotMat3.data[3], rotMat3.data[4], rotMat3.data[5], 0.0,
           rotMat3.data[6], rotMat3.data[7], rotMat3.data[8], 0.0,
           0.0, 0.0, 0.0, 1.0);
    
    return mat;
}

mat4.getViewMatrix  = function (eye, up, centre) {
    var a = eye.copy().subtract(centre);
    var w = a.copy().scalarDiv(a.magnitude());
    var u = up.copy().cross(w);
    u = u.scalarDiv(u.magnitude());
    var v = w.copy().cross(u);
    
    var mat = new mat4();
    mat.set(u.x, u.y, u.z, ((-u.x*eye.x)*(-u.y*eye.y)*(-u.z*eye.z)),
        v.x, v.y, v.z, ((-v.x*eye.x)*(-v.y*eye.y)*(-v.z*eye.z)),
        w.x, w.y, w.z, ((-w.x*eye.x)*(-w.y*eye.y)*(-w.z*eye.z)),
        0, 0, 0, 1.0);
    return mat;
}

mat4.getProjectionMatrix = function (fovy, aspect, zNear, zFar) {
    var fovyRadians = fovy*(Math.PI/180);
    var theta = fovyRadians/2.0;
    var d = 1.0 / Math.tan(theta);
    var A = -((zFar+zNear)/(zFar-zNear));
    var B = -((2*zFar*zNear)/(zFar-zNear));
    
    var mat = new mat4();    
    mat.set(d/aspect, 0, 0, 0,
           0, d, 0, 0,
           0, 0, A, B,
           0, 0, -1, 0);
    return mat;
}

mat4.prototype = {
    set : function (x0, x1, x2, x3,
                    x4, x5, x6, x7,
                    x8, x9, x10, x11,
                    x12, x13, x14, x15) {
        this.data[0] = x0;
        this.data[1] = x1;
        this.data[2] = x2;
        this.data[3] = x3;
        this.data[4] = x4;
        this.data[5] = x5;
        this.data[6] = x6;
        this.data[7] = x7;
        this.data[8] = x8;
        this.data[9] = x9;
        this.data[10] = x10;
        this.data[11] = x11
        this.data[12] = x12;
        this.data[13] = x13;
        this.data[14] = x14;
        this.data[15] = x15;
        return this;
    },
    
    copy : function () {
        var newMat = new mat4();
        for (var i = 0; i < 16; ++i)
        {
            newMat.data[i] = this.data[i];
        }
        return newMat;
    },
    
    multiply4m : function (_mat4) {
        /* this                    _mat4
         * [a1   a2   a3   a4]     [b1   b2   b3   b4]
         * [a5   a6   a7   a8]     [b5   b6   b7   b8]
         * [a9  a10  a11  a12]  x  [b9  b10  b11  b12]
         * [a13 a14  a15  a16]     [b13 b14  b15  b16]
         *
         * [a1*b1+a2*b5+a3*b9+a4*b13, a1*b2+a2*b6+a3*b10+a4*b14, ...]
         * [a5*b1+a6*b5+a7*b9+a8*b13, a5*b2+a6*b6+a7*b10+a8*b14, ...]
         * [...]
         * [...]
         */
        var newMat = new mat4();
        for (var i = 0; i < 16; ++i) 
        {
            var j = ~~(i/4)*4, h = i-j;
            for (var k = j, l = 0; k < j+4; ++k, ++l)
            {
                newMat.data[i] += this.data[k]*_mat4.data[h+l*4];
            }
        }
        this.data = newMat.data;
        return this;
    },
    
    multiply4v : function (_vec4) {
        // TODO
    },
    
    multiply : function (scalar) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] *= scalar;
        }
        return this;
    },
    
    scalarAdd : function (scalar) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] += scalar;
        }
        return this;
    },
    
    add : function (matrix) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] += matrix.data[i];
        }
        return this;
    },
    
    subtract : function (matrix) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] -= matrix.data[i];
        }
        return this;
    }
}

/*
 * 3x3 Matrix
 */
function mat3() {
	this.data = new Float32Array(9);
    this.columns = 3;
    this.rows = 3;
}

mat3.identity = function() {
        var m = new mat3();
		var identityMatrix = new Float32Array(9);
    
        for (var i = 0; i < identityMatrix.length; i++)
        {
            if (i==0 || i%4==0)
            {
                identityMatrix[i] = 1.0;
            }
        }

        m.data = identityMatrix;
		return m;
}

mat3.getDualMatrix = function (vector)
{
    var dualMat = new mat3();
    dualMat.set(0, -vector.z, vector.y,
               vector.z, 0, -vector.x,
               -vector.y, vector.x, 0);
    return dualMat;
}

mat3.getRotationMatrix = function (theta, vector) {
        var aaT = new mat3();
        aaT.set(vector.x*vector.x, vector.x*vector.y, vector.x*vector.z,
                vector.x*vector.y, vector.y*vector.y, vector.y*vector.z,
               vector.x*vector.z, vector.y*vector.z, vector.z*vector.z);
        
        var dualMat = mat3.getDualMatrix(vector);
        
        var cosT = Math.cos(theta);
        var sinT = Math.sin(theta);
        
        //cos(theta)*identity+(1-cos(theta)*aaT+sin(theta)*dualMatrix
        
        var retMat = mat3.identity();
        retMat.multiply(cosT);
        
        aaT.multiply(1-cosT);
        dualMat.multiply(sinT);
        
        retMat.add(aaT);
        retMat.add(dualMat);
        
        return retMat;
}

mat3.prototype = {
    set : function (x0, x1, x2,
                    x3, x4, x5,
                    x6, x7, x8) 
    {
        this.data[0] = x0;
        this.data[1] = x1;
        this.data[2] = x2;
        this.data[3] = x3;
        this.data[4] = x4;
        this.data[5] = x5;
        this.data[6] = x6;
        this.data[7] = x7;
        this.data[8] = x8;
        return this;
    },
    
    multiply : function (scalar) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] *= scalar;
        }
        return this;
    },
    
    scalarAdd : function (scalar) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] += scalar;
        }
        return this;
    },
    
    add : function (matrix) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] += matrix.data[i];
        }
        return this;
    },
    
    subtract : function (matrix) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] -= matrix.data[i];
        }
        return this;
    },
    
    product : function (matrix) {
        this.set(
            this.data[0]*matrix.data[0]+this.data[1]*matrix.data[3]+this.data[2]*this.data[6],
            this.data[0]*matrix.data[1]+this.data[1]*matrix.data[4]+this.data[2]*this.data[7],
            this.data[0]*matrix.data[2]+this.data[1]*matrix.data[5]+this.data[2]*this.data[8],
            this.data[3]*matrix.data[0]+this.data[4]*matrix.data[3]+this.data[5]*this.data[6],
            this.data[3]*matrix.data[1]+this.data[4]*matrix.data[4]+this.data[5]*this.data[7],
            this.data[3]*matrix.data[2]+this.data[4]*matrix.data[5]+this.data[5]*this.data[8],
            this.data[6]*matrix.data[0]+this.data[7]*matrix.data[3]+this.data[8]*this.data[6],
            this.data[6]*matrix.data[1]+this.data[7]*matrix.data[4]+this.data[8]*this.data[7],
            this.data[6]*matrix.data[2]+this.data[7]*matrix.data[5]+this.data[8]*this.data[8]
        );
        return this;
    }
}

/*
 * Vectors
 */
function vec3 ()
{
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

vec3.prototype = {
    set : function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
    
    copy : function () {
        var newVec = new vec3();
        newVec.x = this.x;
        newVec.y = this.y;
        newVec.z = this.z;
        return newVec;
    },
    
    magnitude : function () {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    },
    
    getUnitVector : function () {
        // Unit Vector
        var unitVec = this.copy();
        var mag = unitVec.magnitude();
        unitVec.x /= mag;
        unitVec.y /= mag;
        unitVec.z /= mag;
        return unitV
    },
    
    scalarDiv : function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    },
    
    add : function (otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        this.z += otherVec.z;
        return this;
    },
    
    subtract : function (otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        this.z -= otherVec.z;
        return this;
    },
    
    dot : function (otherVec) {
        return (this.x*otherVec.x) + (this.y*otherVec.y);        
    },
    
    getTheta : function (otherVec) {
        return Math.acos(this.dot(otherVec) / (this.magnitude() * otherVec.magnitude()));
    },
    
    getProjection : function (otherVec) {
        var projectedVector = this.copy();        
        var aMag = projectedVector.magnitude();
        return projectedVector.multiply((projectedVector.dot(otherVec) / (aMag*aMag)));
    },
    
    cross : function (otherVec) {
        this.x = (this.y*otherVec.z) - (otherVec.y*this.z);
        this.y = (this.z*otherVec.x) - (otherVec.z*this.x);
        this.z = (this.x*otherVec.y) - (otherVec.x*this.y);
        return this;
    }
}

function vec4 (_vec3)
{
    if (_vec3)
    {
        this.x = _vec3.x;
        this.y = _vec3.y;
        this.z = _vec3.z;
        this.w = 1.0;
    } else {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
}

vec4.prototype = {
    copy : function () {
        var newVec = new vec4();
        newVec.x = this.x;
        newVec.y = this.y;
        newVec.z = this.z;
        newVec.w = this.w;
        return newVec;
    },
    
    getCartesianVector : function () {
        var vec = new vec3();
        if (this.w == 0)
        {
            vec.x = this.x;
            vec.y = this.y;
            vec.z = this.z;
        } else {
            vec.x = this.x / this.w;
            vec.y = this.y / this.w;
            vec.z = this.z / this.w;
        }
        return vec;
    }
}