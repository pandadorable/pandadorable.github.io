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