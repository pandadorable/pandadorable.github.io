//display Node
function Screen(){
    FactoryConstructor(this, ["input"], [], false);
    this.size = [250, 70];
}

Screen.title = "Screen"
Screen.prototype.onExecute = function() {
    FactoryExecutor(this);
};
Screen.prototype.onDrawBackground = function(ctx) {
    if (this.flags.collapsed) {
        return;
    }
    this.properties.input[0].drawImage(ctx,[-30,-10],this.size);
};

LiteGraph.registerNodeType("satisfactory/screen", Screen );