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