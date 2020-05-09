var LookCamera = pc.createScript('lookCamera');

// Script attributes to control the sensitivity of the camera look with touch and mouse
LookCamera.attributes.add("mouseLookSensitivity", {type: "number", default: 0, title: "Mouse Look Sensitivity"});
LookCamera.attributes.add("touchLookSensitivity", {type: "number", default: 0, title: "Touch Look Sensitivity"});

// 'Snappiness' factor (how fast does the camera reach the target rotation and distance)
LookCamera.attributes.add("snappinessFactor", {type: "number", default: 0.1, title: "Snappiness Factor", description: "Lower is faster"});


LookCamera.prototype.initialize = function () {
    // Cache some temp variables for use later
    this._tempQuat1 = new pc.Quat();
    this._tempQuat2 = new pc.Quat();
    this._tempVec3_1 = new pc.Vec3();
    
    // Calculate the camera euler angle rotation around x and y axes
    // This allows us to place the camera at a particular rotation to begin with in the scene
    var quat = this.entity.getLocalRotation();
    this.ey = this.getYaw(quat) * pc.math.RAD_TO_DEG;
    this.ex = this.getPitch(quat, this.ey) * pc.math.RAD_TO_DEG;
    
    // The target rotation for the camera to rotate to
    this.targetEx = this.ex;
    this.targetEy = this.ey;
            
    // Workaround for mouse movement as the first move event can give very large
    // difference moved in screen position 
    this.moved = false;

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.app.mouse.disableContextMenu();

    // Store the position of the touch so we can calculate the distance moved
    this.lastTouchPosition = new pc.Vec2();

    this.addEventCallbacks();
};


LookCamera.prototype.addEventCallbacks = function() {
    if (this.app.mouse) {
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    }
    
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
    }
};


LookCamera.prototype.update = function (dt) {
    // Update the camera's orientation to rotate smoothly towards the target rotation
    // By using lerp in this way, the rotation will go slower as it gets closer to
    // the target rotation
    var lerp = 1;
    if (this.snappinessFactor > 0) {
        lerp = dt / this.snappinessFactor;
    }
    
    this.ex = pc.math.lerp(this.ex, this.targetEx, lerp);
    this.ey = pc.math.lerp(this.ey, this.targetEy, lerp);
        
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
};


LookCamera.prototype.moveCamera = function(dx, dy, sensitivity) {
    // Update the current Euler angles, clamp the pitch.
    if (!this.moved) {
        // first move event can be very large
        this.moved = true;
        return;
    }
        
    this.targetEx -= dy * sensitivity;
    this.targetEx = pc.math.clamp(this.targetEx, -90, 90);
    this.targetEy -= dx * sensitivity;  
};


LookCamera.prototype.onMouseMove = function (event) {
    // Only update the camera target rotation only if the left mouse
    // button is pressed down
    if (this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
        this.moveCamera(event.dx, event.dy, this.mouseLookSensitivity);
    }
};


LookCamera.prototype.onTouchStart = function(event) {
    // We only care about the first touch. As the user touches the screen, 
    // we stored the current touch position
    var touch = event.touches[0];
    this.lastTouchPosition.set(touch.x, touch.y);
};


LookCamera.prototype.onTouchMove = function(event) {
    // We only care about the first touch. Work out the difference moved since the last event
    // and use that to update the camera target position 
    var touch = event.touches[0];
    this.moveCamera(-(touch.x - this.lastTouchPosition.x), -(touch.y - this.lastTouchPosition.y), this.touchLookSensitivity);
    this.lastTouchPosition.set(touch.x, touch.y);
};


LookCamera.prototype.getYaw = function () {    
    var forward = this.entity.forward.clone();
    return Math.atan2(-forward.x, -forward.z);    
};


LookCamera.prototype.getPitch = function(quaternion, yaw) {
    var quatWithoutYaw = this._tempQuat1;
    var yawOffset = this._tempQuat2;
    
    yawOffset.setFromEulerAngles(0, -yaw, 0);
    quatWithoutYaw.mul2(yawOffset, quaternion);
    
    var transformedForward = this._tempVec3_1;
    
    quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);
    
    return Math.atan2(transformedForward.y, -transformedForward.z) ;      
};