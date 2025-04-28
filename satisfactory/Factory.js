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