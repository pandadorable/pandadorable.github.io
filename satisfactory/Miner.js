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

  this.properties.out[0].setNumber(purity_modifier * mining_speed);

  FactoryExecutor(this);

  // this.oreImage.src = './satisfactory/ressources/'+(ressource_path[this.properties.ore] || 'Null.png');

  // this.setOutputData(0, parseFloat(this.output_speed));
}

// Miner.prototype.onDrawBackground = function(ctx) {
//     // On attend que l'image soit chargée pour l'afficher
//     ctx.drawImage(this.oreImage, this.size[0]/2-this.oreImageSize[0]/2-40, this.size[1]-this.oreImageSize[1]-15, this.oreImageSize[0], this.oreImageSize[1]);
//     ctx.fillStyle = "white";
//     ctx.font = "bold 30px Arial"
//     ctx.fillText("x"+parseFloat(this.output_speed).toFixed(2), this.size[0]/2+10-40, this.size[1]-20);
// };

//register in the system
LiteGraph.registerNodeType("satisfactory/miner", Miner );