//display Node
function Screen(){
    this.addInput("Value", 0, { label: "" });
    this.value = 0;
}
Screen.title = "Screen"
Screen.prototype.onExecute = function() {
    if (this.inputs[0]) {
        this.value = this.getInputData(0);
    }
};
Screen.toString = function(o) {
    if (o == null) {
        return "null";
    } else if (o.constructor === Number) {
        return o.toFixed(3);
    } else if (o.constructor === Array) {
        var str = "[";
        for (var i = 0; i < o.length; ++i) {
            str += Screen.toString(o[i]) + (i + 1 != o.length ? "," : "");
        }
        str += "]";
        return str;
    } else {
        return String(o);
    }
};
Screen.prototype.onDrawBackground = function(ctx) {
    //show the current value
    this.inputs[0].label = Screen.toString(this.value);
};
LiteGraph.registerNodeType("satisfactory/screen", Screen );

//node constructor class
function Miner()
{
  
  this.mark = this.addWidget("number","Mark",1,{min: 1, max: 3, step:10, precision: 0})
  this.purity = this.addWidget("combo","Purity","Normal",{values: ["Impure","Normal","Pure"]})
  this.overclocking = this.addWidget("slider","Overclocking",100,{min: 0, max: 250, step:1, precision: 0})
  
  this.addOutput("Ore","number");
}

//name to show
Miner.title = "Miner";

//function to call when the node is executed
Miner.prototype.onExecute = function()
{
  const mining_speed = {
    1: 60,
    2: 120,
    3: 240
  }[this.mark.value] ?? 0;

  const purity_modifier = {
    "Impure": 0.5,
    "Normal": 1,
    "Pure": 2
  }[this.purity.value] ?? 0;

  output_speed = purity_modifier * mining_speed * this.overclocking.value / 100;

  this.setOutputData(0, parseFloat(output_speed));
}

//register in the system
LiteGraph.registerNodeType("satisfactory/miner", Miner );
