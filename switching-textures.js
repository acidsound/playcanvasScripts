var SwitchingTextures = pc.createScript('switchingTextures');

// Reference a list of textures that we can cycle through
SwitchingTextures.attributes.add("textures", {type: "asset", assetType: "texture", array: true, title: "Textures"});

// initialize code called once per entity
SwitchingTextures.prototype.initialize = function() {
    var self = this;
    
    // Keep track of which texture in the array we are currently using
    this.textureIndex = 0;

    // Change textures every second
    setInterval(function () {
        self.changeToNextTexture();
    }, 1000);
};

SwitchingTextures.prototype.changeToNextTexture = function(dt) {
    // Index the next texture in the list, wrapping around if we reach the end
    this.textureIndex = (this.textureIndex + 1) % this.textures.length;

    // Reference the texture
    var texture = this.textures[this.textureIndex].resource;        

    // Go through all the mesh instances of the model and change the diffuse texture on the
    // material to our new one
    var meshInstances = this.entity.model.meshInstances;
    for (var i = 0; i < meshInstances.length; ++i) { 
        var mesh = meshInstances[i];
        mesh.material.diffuseMap = texture;
        mesh.material.update();
    }
};