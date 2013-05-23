window.SEPARATION_WEIGHT = 1;
window.ALIGNMENT_WEIGHT  = 2;
window.COHESION_WEIGHT   = 0.05;
window.MAX_SPEED = 2;
window.NEIGHBOUR_RADIUS = 100;
window.MAX_FORCE = 0.05;
window.DESIRED_SEPARATION = 20;
window.AVOIDANCE_WEIGHT = 100;
window.BOID_VISION = 400;
window.OBJECT_RADIUS_EXCESS = 60;
window.SWERVE_WEIGHT = 1;
window.WAYPOINT_WEIGHT = 0.1;

var containerWidth = 1000;
var containerHeight = 700;

function Boid(options) {
    this.radius = 5; //# "radius" of the triangle.
    this.location = null;
    this.velocity = null;

    $(".aquarium").append("<div class='fish'></div>");
    this.$div = $(".aquarium .fish:last");

    if (!options) options = {};

    this.location = options.location || new Vector(Math.random() * containerWidth, Math.random() * containerHeight);
    this.velocity = options.velocity || new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
}
Boid.prototype = {
    flock: function(neighbours, cylinders) {
        separation = this.separate(neighbours).multiply(SEPARATION_WEIGHT)
        alignment  = this.align(neighbours).multiply(ALIGNMENT_WEIGHT)
        cohesion   = this.cohere(neighbours).multiply(COHESION_WEIGHT)
        //toWayPoint        = @toWayPoint(new Vector @processing.width, @processing.height/2).multiply(WAYPOINT_WEIGHT)
        //avoidCollision    = @avoidCollision(cylinders).multiply(AVOIDANCE_WEIGHT)
        //swerveFromObjects = @swerveFromObjects(cylinders).multiply(SWERVE_WEIGHT)
        //#avoidWalls     = @avoidWalls().multiply(AVOIDANCE_WEIGHT)
        return separation.add(alignment).add(cohesion); //.add(avoidCollision).add(swerveFromObjects).add(toWayPoint)
    },
    step: function(neighbours, cylinders) {
        acceleration = this.flock(neighbours, cylinders);
        this.velocity.add(acceleration).limit(MAX_SPEED);
        this.location.add(this.velocity);
        this._wrapIfNeeded();
        this.theta = this.velocity.heading() + Math.PI * 2;
        
        this.$div.css({
            left: this.location.x,
            top: this.location.y,
            rotate: (this.theta/(2*Math.PI)*360) + 'deg' 
        });
    },
    _wrapIfNeeded: function() {
        var minX = -this.radius * 2;
        var minY = -this.radius * 2;
        var maxX = containerWidth + this.radius * 2;
        var maxY = containerHeight + this.radius * 2;

        if (this.location.x > maxX) this.location.x = minX;
        if (this.location.y > maxY) this.location.y = minY;
        if (this.location.x < minX) this.location.x = maxX;
        if (this.location.y < minY) this.location.y = maxY;
    },
    separate: function(neighbours) {
        var boid, count, distance, mean, _i, _len;
        mean = new Vector;
        count = 0;
        for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
            var boid = neighbours[_i];
            var distance = this.location.distance(boid.location);
            if (distance > 0 && distance < DESIRED_SEPARATION) {
                mean.add(Vector.subtract(this.location, boid.location).normalize().divide(distance));
                count++;
            }
        }
        if (count > 0) {
            mean.divide(count);
        }
        mean.limit(MAX_FORCE);
        return mean;
    },
    align: function(neighbours) {
        var boid, count, distance, mean, _i, _len;
        mean = new Vector;
        count = 0;
        for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
            boid = neighbours[_i];
            distance = this.location.distance(boid.location);
            if (distance > 0 && distance < NEIGHBOUR_RADIUS) {
                mean.add(boid.velocity);
                count++;
            }
            if (count > 0) {
                mean.divide(count);
            }
            mean.limit(MAX_FORCE);
        }
        return mean;
    },
    cohere: function(neighbours) {
        var boid, count, distance, sum, _i, _len;
        sum = new Vector;
        count = 0;
        for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
            boid = neighbours[_i];
            distance = this.location.distance(boid.location);
            if (distance > 0 && distance < NEIGHBOUR_RADIUS) {
                sum.add(boid.location);
                count++;
            }
        }
        if (count > 0) {
            return this.steer_to(sum.divide(count));
        }
        return sum;
    },
    steer_to: function(target) {
        var desired, distance, steer;
        desired = Vector.subtract(target, this.location);
        distance = desired.magnitude();
        steer = new Vector;
        if (distance > 0) {
            desired.normalize();
            if (distance < 100) {
                desired.multiply(MAX_SPEED * (distance / 100.0));
            }
            else {
                desired.multiply(MAX_SPEED);
            }
            steer = desired.subtract(this.velocity);
            steer.limit(MAX_FORCE);
        }
        return steer;
    }
};
