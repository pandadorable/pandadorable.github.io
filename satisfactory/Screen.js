//display Node
function Screen(){
    this.addInput("Item", "SatisfactoryItem");
    this.value = new SatisfactoryItem();
}

Screen.title = "Screen"
Screen.prototype.onExecute = function() {
    if (this.getInputData(0)) {
        this.value.set(this.getInputData(0));
    }
};
Screen.prototype.onDrawBackground = function(ctx) {
    //show the current value
    this.inputs[0].label = this.value.toString();
};
LiteGraph.registerNodeType("satisfactory/screen", Screen );