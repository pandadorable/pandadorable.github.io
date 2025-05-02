let global_ores = []
let ressource_path = []

fetch('./satisfactory/items.json')
  .then(response => response.json())
  .then(data => {
    global_ores = data.ores;
    console.log(global_ores);
  })
  .catch(error => console.error("Erreur lors du chargement du fichier JSON", error));


  fetch('./satisfactory/images.json')
  .then(response => response.json())
  .then(data => {
    ressource_path = data;
    console.log(ressource_path);
  })
  .catch(error => console.error("Erreur lors du chargement du fichier JSON", error));


class SatisfactoryItem {
  number = 0;
  name = "None";
  oreImage = new Image();
  oreImageSize = [50,50];

  constructor() {
    this.oreImage.src = ressource_path[this.name];
  }

  toString() {
    return this.number+" "+this.name;
  }

  drawImage(ctx, pos, size) {
    ctx.drawImage(this.oreImage, size[0]/2-this.oreImageSize[0]/2+pos[0], size[1]-this.oreImageSize[1]+pos[1], this.oreImageSize[0], this.oreImageSize[1]);
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial"
    ctx.fillText("x"+parseFloat(this.number).toFixed(2), size[0]/2+pos[0]+10, size[1]+pos[1]-5);
  }

  set(otherItem) {
    this.number = otherItem.number;
    this.setName(otherItem.name);
    this.oreImageSize = otherItem.oreImageSize;
  }

  setNumber(number){
    this.number = number;
  }

  times(mux) {
    this.number *= mux;
  }

  setName(name) {
    if(this.name == name){
      return;
    }
    this.name = name;
    this.oreImage.src = ressource_path[this.name];
  }


}
/**
    * Construct the basic 
    * @method registerNodeType
    * @param {Class} factory_class class containing the structure of a node
    * @param {number} input list of the input's names
    * @param {number} output list of the output's names
*/
function FactoryConstructor(factory_class, input, output, overclockable = true) {

    factory_class.properties = {...factory_class.properties, ...{input: {}, output: {}, buffer: {}}}

    input.forEach((name, index) => {
        factory_class.properties.input[index] = new SatisfactoryItem();
        factory_class.addInput(name,"SatisfactoryItem");
    });

    output.forEach((name, index) => {
        factory_class.properties.output[index] = new SatisfactoryItem();
        factory_class.properties.buffer[index] = new SatisfactoryItem();
        factory_class.addOutput(name,"SatisfactoryItem");
    });

    if(overclockable) {
        factory_class.properties = {...factory_class.properties, ...{overclocking: 100}};
        factory_class.addWidget("number","Overclocking",100,{property: "overclocking", min: 0, max: 250, step:0.1, precision: 2});
    }
}

function FactoryExecutor(factory_class) {
    Object.keys(factory_class.properties.input).forEach(key => {
        factory_class.properties.input[key].set(factory_class.getInputData(key))
    })

    Object.keys(factory_class.properties.buffer).forEach(key => {
        factory_class.properties.output[key].setNumber(factory_class.properties.buffer[key].number * factory_class.properties.overclocking / 100);
        factory_class.setOutputData(key,factory_class.properties.output[key])
    })
}
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
