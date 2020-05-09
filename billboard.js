var Billboard = pc.createScript('billboard');

// initialize code called once per entity
Billboard.prototype.initialize = function() {
    this.camera = this.app.root.findByName('Camera');
};

// update code called every frame
Billboard.prototype.update = function(dt) {
    this.entity.setRotation(this.camera.getRotation());
};