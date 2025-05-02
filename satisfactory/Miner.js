//node constructor class
function Miner()
{
  this.properties = {mark: 1, purity: "Normal", ore: "None"}
  this.resizable = false;

  this.addWidget("number","Mark",1,{property: "mark", min: 1, max: 3, step:10, precision: 0});
  this.addWidget("combo","Purity","Normal",{property: "purity", values: ["Impure","Normal","Pure"]});
  this.addWidget("combo","Ressource Node","None",{property: "ore", values: global_ores});

  FactoryConstructor(this, [], ["ore"]);

  this.size = [250, 200];
}

//name to show
Miner.title = "Miner";

Miner.prototype = Object.create(LiteGraph.LGraphNode.prototype);
Miner.prototype.constructor = Miner;

//function to call when the node is executed
Miner.prototype.onExecute = function()
{
  const mining_speed = {
    1: 60,
    2: 120,
    3: 240
  }[this.properties.mark] ?? 0;

  const purity_modifier = {
    "Impure": 0.5,
    "Normal": 1,
    "Pure": 2
  }[this.properties.purity] ?? 0;

  this.properties.buffer[0].setNumber(purity_modifier * mining_speed);
  this.properties.buffer[0].setName(this.properties.ore);
  this.properties.output[0].setName(this.properties.ore);

  FactoryExecutor(this);
}

Miner.prototype.onDrawBackground = function(ctx) {
  if (this.flags.collapsed) {
    return;
  }
  this.properties.output[0].drawImage(ctx,[-40,-15],this.size);
};

//register in the system
LiteGraph.registerNodeType("satisfactory/miner", Miner );