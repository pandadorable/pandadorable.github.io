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