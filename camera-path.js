var CameraPath = pc.createScript('cameraPath');

CameraPath.attributes.add("pathRoot", {type: "entity", title: "Path Root"});
CameraPath.attributes.add("duration", {type: "number", default: 10, title: "Duration Secs"});

CameraPath.attributes.add("startTime", {
    type: "number", 
    default: 0, 
    title: "Start Time (Secs)", 
    description: "Start the path from a specific point in time"
});

// initialize code called once per entity
CameraPath.prototype.initialize = function() {
    // Generate the camera path using pc.Curve: http://developer.playcanvas.com/en/api/pc.Curve.html
    this.createPath();
    
    // Learn more about live attribute tweaking from this project: https://playcanvas.com/editor/scene/475560
    // If the user decides to change the path while the app is running, this allows for quicker iteration
    this.on("attr:pathRoot", function (value, prev) {
        if (value) {
            this.createPath();
            this.time = 0;    
        }
    });
    
    this.on("attr:time", function (value, prev) {
        this.time = pc.math.clamp(this.startTime, 0, this.duration);    
    });
    
    this.time = pc.math.clamp(this.startTime, 0, this.duration);    
    
    // Caching some Vec3 objects that will be used in the update loop continously 
    // so we don't keep triggering the garbage collector
    this.lookAt = new pc.Vec3();
    this.up = new pc.Vec3();
};


// update code called every frame
CameraPath.prototype.update = function(dt) {
    this.time += dt;
    
    // Loop the path flythrough animation indefinitely 
    if (this.time > this.duration) {
        this.time -= this.duration;
    }
    
    // Work out how far we are in time we have progressed along the path
    var percent = this.time / this.duration;
    
    // Get the interpolated values for the position from the curves     
    this.entity.setPosition(this.px.value(percent), this.py.value(percent), this.pz.value(percent));
    
    // Get the interpolated values for the look at point from the curves 
    this.lookAt.set(this.tx.value(percent), this.ty.value(percent), this.tz.value(percent));
    
    // Get the interpolated values for the up vector from the curves     
    this.up.set(this.ux.value(percent), this.uy.value(percent), this.uz.value(percent));
    
    // Make the camera look at the interpolated target position with the correct
    // up direction to allow for camera roll and to avoid glimbal lock
    this.entity.lookAt(this.lookAt, this.up);
};


CameraPath.prototype.createPath = function () {
    var curveMode = pc.CURVE_CARDINAL;
    
    // Create curves for position
    this.px = new pc.Curve(); 
    this.px.type = curveMode;
    
    this.py = new pc.Curve(); 
    this.py.type = curveMode;    
    
    this.pz = new pc.Curve(); 
    this.pz.type = curveMode;
    
    // Create curves for target look at position
    this.tx = new pc.Curve();
    this.tx.type = curveMode;
    
    this.ty = new pc.Curve();
    this.ty.type = curveMode;
    
    this.tz = new pc.Curve();
    this.tz.type = curveMode;
    
    // Create curves for the 'up' vector for use with the lookAt function to 
    // allow for roll and avoid gimbal lock
    this.ux = new pc.Curve();
    this.ux.type = curveMode;
    
    this.uy = new pc.Curve();
    this.uy.type = curveMode;
    
    this.uz = new pc.Curve();
    this.uz.type = curveMode;
    
    var nodes = this.pathRoot.children;  
    
    // Get the total linear distance of the path (this isn't correct but gives a decent approximation in length)
    var pathLength = 0;
    
    // Store the distance from the start of the path for each path node
    var nodePathLength = [];
    
    // For use when calculating the distance between two nodes on the path
    var distanceBetween = new pc.Vec3();
    
    // Push 0 as we are starting our loop from 1 for ease
    nodePathLength.push(0);
    
    for (i = 1; i < nodes.length; i++) {
        var prevNode = nodes[i-1];
        var nextNode = nodes[i];
        
        // Work out the distance between the current node and the one before in the path
        distanceBetween.sub2(prevNode.getPosition(), nextNode.getPosition());
        pathLength += distanceBetween.length();
        
        nodePathLength.push(pathLength);
    }
        
    for (i = 0; i < nodes.length; i++) {
        // Calculate the time for the curve key based on the distance of the path to the node
        // and the total path length so the speed of the camera travel stays relatively
        // consistent throughout
        var t = nodePathLength[i] / pathLength;
        
        var node = nodes[i];
        
        var pos = node.getPosition();
        this.px.add(t, pos.x);
        this.py.add(t, pos.y);
        this.pz.add(t, pos.z);
        
        // Create and store a lookAt position based on the node position and the forward direction
        var lookAt = pos.clone().add(node.forward);
        this.tx.add(t, lookAt.x);
        this.ty.add(t, lookAt.y);
        this.tz.add(t, lookAt.z);
        
        var up = node.up;
        this.ux.add(t, up.x);
        this.uy.add(t, up.y);
        this.uz.add(t, up.z);
    }
};
