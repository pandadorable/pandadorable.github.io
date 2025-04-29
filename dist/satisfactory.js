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


function makeOvercloackable(node_class) {
  
}

class SatisfactoryItem {
  number = 0;
  name = "Null";
  oreImage = new Image();
  oreImageSize = [50,50];

  constructor() {
    this.oreImage.src = ressource_path[this.name];
  }

  toString() {
    return this.number+" "+this.name;
  }

  set(otherItem) {
    this.number = otherItem.number;
    this.name = otherItem.name;
    this.oreImageSize = otherItem.oreImageSize;
    this.oreImage.src = ressource_path[this.name];
  }

  setNumber(number){
    this.number = number;
  }

  times(mux) {
    this.number *= mux;
  }

  setName(name) {
    this.name = name;
    this.oreImage.src = ressource_path[this.name];
  }


}
/**
    * Construct the basic 
    * @method registerNodeType
    * @param {Class} factory_class class containing the structure of a node
    * @param {number} input number of input
    * @param {number} second_output number of output
*/
function FactoryConstructor(factory_class, input, output) {

    factory_class.properties = {...factory_class.properties, ...{in: {}, out: {}, overclockable: true}}

    input.forEach((name, index) => {
        factory_class.properties.in[index] = new SatisfactoryItem();
        factory_class.addInput(name,"SatisfactoryItem");
    });

    output.forEach((name, index) => {
        factory_class.properties.out[index] = new SatisfactoryItem();
        factory_class.addOutput(name,"SatisfactoryItem");
    });

    if(factory_class.properties.overclockable) {
        factory_class.properties = {...factory_class.properties, ...{overclocking: 100}};
        factory_class.addWidget("slider","Overclocking",100,{property: "overclocking", min: 0, max: 250, step:1, precision: 2});
    }
}

function FactoryExecutor(factory_class) {
    Object.keys(factory_class.properties.in).forEach(key => {
        factory_class.setInputData(key,factory_class.properties.in[key])
    })

    Object.keys(factory_class.properties.out).forEach(key => {
        factory_class.setOutputData(key,factory_class.properties.out[key])
    })

    // factory_class.properties.out.array.forEach(([index,item]) => {
    //     factory_class.setOutputData(index,item)
    // })
}
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
//node constructor class
function Miner()
{
  this.properties = {mark: 1, purity: "Normal", ore: "None", nodeItem: new SatisfactoryItem()}
  this.resizable = false;

  this.updateNodeItem = function(){
    console.log(this.properties.mark);
  }

  this.addWidget("number","Mark",1,
    {property: "mark", min: 1, max: 3, step:10, precision: 0},
    this.updateNodeItem());

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
//     // On attend que l'image soit chargÃ©e pour l'afficher
//     ctx.drawImage(this.oreImage, this.size[0]/2-this.oreImageSize[0]/2-40, this.size[1]-this.oreImageSize[1]-15, this.oreImageSize[0], this.oreImageSize[1]);
//     ctx.fillStyle = "white";
//     ctx.font = "bold 30px Arial"
//     ctx.fillText("x"+parseFloat(this.output_speed).toFixed(2), this.size[0]/2+10-40, this.size[1]-20);
// };

//register in the system
LiteGraph.registerNodeType("satisfactory/miner", Miner );
