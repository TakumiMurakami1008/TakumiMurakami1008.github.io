class Vec3
{

    // Constructor
    constructor( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Addition
    add( v )
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    // Subtraction
    sub( v )
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    // Summary
    sum()
    {
        return this.x + this.y + this.z;
    }

    // Minimum
    min()
    {
        const m = this.x < this.y ? this.x : this.y;
        return m < this.z ? m : this.z;
    }

    // Maximum
    max()
    {
        const m = this.x > this.y ? this.x : this.y;
        return m > this.z ? m : this.z;
    }

    // Median
    mid()
    {
        return this.sum() - this.min() - this.max();
    }

    // Cross product
    cross( v )
    {
        var tmpx = this.x;
        var tmpy = this.y;
        var tmpz = this.z;

        this.x = tmpy * v.z - tmpz * v.y;
        this.y = tmpz * v.x - tmpx * v.z;
        this.z = tmpx * v.y - tmpy * v.x;

        return this;
    }

    // Length
    len()
    {
        return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z );
    }
    
}