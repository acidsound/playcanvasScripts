// NOTE: THIS SCRIPT ONLY WORKS IF 'PRESERVE DRAWING BUFFER' IS ENABLED IN PROJECT SETTINGS

var Screenshot = pc.createScript('screenshot');

Screenshot.prototype.initialize = function() {
    this._triggerScreenshot = false;
    this._window = null;
    this.app.on('ui:takeScreenshot', function () {
        this._triggerScreenshot = true;
        
        // Open a new tab
        this._window = window.open('', '');
        this._window.document.title = "Screenshot";
        this._window.document.body.style.margin = "0";
    }, this);
    
    this.app.on('postrender', this.postRender, this);
};

Screenshot.prototype.takeScreenshot = function () {
    // Get application canvas element
    var canvas = this.app.graphicsDevice.canvas;

    // Show the image data in a new window/tab. 
    var img = new Image();
    img.src = canvas.toDataURL();
    this._window.document.body.appendChild(img);
};

Screenshot.prototype.postRender = function () {
    if (this._triggerScreenshot) {
        this.takeScreenshot();
        this._triggerScreenshot = false;
    }
};