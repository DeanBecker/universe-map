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
		var identityMatrix = new Float32Array(15);

        for (var i = 0; i < identityMatrix.length; i++)
        {
            if (i==0 || i%5==0)
            {
                identityMatrix[i] = 1.0;
            } else {
                identityMatrix[i] = 0;
            }
        }

		return identityMatrix;
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
            } else {
                identityMatrix[i] = 0;
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
    },
    
    multiply : function (scalar) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] *= scalar;
        }
    },
    
    scalarAdd : function (scalar) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] += scalar;
        }
    },
    
    add : function (matrix) {
        for (var i = 0; i < this.data.length; ++i)
        {
            this.data[i] += matrix.data[i];
        }
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
    copy : function () {
        var newVec = new vec3();
        newVec.x = this.x;
        newVec.y = this.y;
        newVec.z = this.z;
        return newVec;
    },
    
    magnitude : function () {
        return Math.sqrt(this.x*this.x + this.y+this.y * this.z*this.z);
    },
    
    getUnitVector : function () {
        // Unit Vector
        var unitVec = this.copy();
        var mag = unitVec.magnitude();
        unitVec.x /= mag;
        unitVec.y /= mag;
        unitVec.z /= mag;
        return unitVec;
    },
    
    add : function (otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        this.z += otherVec.z;
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

function vec4 ()
{
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
}