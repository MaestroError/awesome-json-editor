class aje {

    /**
     * @todo Refactor aje Class, make it simple and add lots of comments
     */

    constructor(conf = {}, configUrl = "", fetchUrl = "", fetched = false) {
        this.defineGroups();
        this.defineTypes();
        // get main object
        if(fetched) {
            this.fetchUrl = fetchUrl;
            // use get main object outside to interact with computed properties
            this.getMainObject();
        } else {
            // Default main object
            this.mainObject = [
                {
                    // card
                    type:"object",
                    key:"Main-Object",
                    inputs: [
                        {
                            type:"int",
                            key:"age",
                            value:24
                        },
                        {
                            type:"string",
                            key:"name",
                            value:"Revaz"
                        },
                        {
                            type:"object",
                            key:"city",
                            value:{
                                // card
                                type:"object",
                                key:"city",
                                inputs: [
                                    {
                                        type:"string",
                                        key:"name",
                                        value:"Revaz"
                                    }
                                ]
                            }
                        },
                        {
                            type:"array",
                            key:"Ports",
                            value:{
                                // card
                                type:"array",
                                key:"Ports",
                                inputs: [
                                    {
                                        type:"int",
                                        key:"age",
                                        value:24
                                    },
                                    {
                                        type:"string",
                                        key:"name",
                                        value:"re"
                                    },
                                    {
                                        type:"array",
                                        key:"city",
                                        value:{
                                            // card
                                            type:"array",
                                            key:"city",
                                            inputs: [
                                                {
                                                    type:"int",
                                                    key:"age",
                                                    value:24
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            ];
        }
        
        // define some data
        this.allowedConfigs = [
            'save',
            'saveUrl',
            'fetchUrl',
            'configUrl',
            'allowImport',
            'canImport',
            'maxDepth',
            'allowActions',
            'importDeny',
            'importGroups',
            "denyDelete"
        ]

        if (conf && Object.keys(conf).length > 0) {
            this.setConfigs(conf);
        } else {
            this.configUrl = configUrl;
            this.getConfigs();
        }

        
        this.jsn = {}
    }

    /*
    {
        "value": "24",
        "inp": 0, // input index
        "card_n": 0, // card Index
        "edited": "value"
    }
    */
    updateObj(val){
        // set object value by coordinates
        // console.log(this.objectGroups)
        if(this.mainObject[val.card_n].inputs[val.inp] !== undefined) {
            this.mainObject[val.card_n].inputs[val.inp][val.edited] = val.value;
            if (this.mainObject[val.card_n].inputs[val.inp].type == "array" || this.mainObject[val.card_n].inputs[val.inp].type == "object") {
                if (val.edited == "key") {
                    this.mainObject[val.card_n].inputs[val.inp].value.key = val.value;
                }
                if (val.value.type) {
                    this.mainObject[val.card_n].inputs[val.inp].type = val.value.type
                }
            }
        }
    }

    removeInput(val) {
        this.mainObject[val.card_n].inputs.splice(val.inp, 1);
    }
    addNewCard(val) {
        if(this.maxDepth){
            if(this.maxDepth-1 <= val.childOf.card_n) {
                console.log("ERROR: Max Depth is "+this.maxDepth)
                return;
            }
        }
        // this.mainObject.push(val);
        // this.mainObject = [... this.mainObject, val];
        this.mainObject = this.mainObject.concat(val);
    }
    resetCards(val) {
        let cardIndex = val.childOf.card_n;
        let len = this.mainObject.length-1;
        
        for (let i = len; i > cardIndex; i--) {
            this.saveCard(this.mainObject[i]);
            this.mainObject.splice(i, 1);
        }
        this.addNewCard(val);
    }
    resetBeforeSave() {;
        let cardIndex = 0;
        let len = this.mainObject.length-1;
        
        for (let i = len; i > cardIndex; i--) {
            this.saveCard(this.mainObject[i]);
            this.mainObject.splice(i, 1);
        }
    }
    saveCard(obj){
        let val = obj.childOf;
        val.value = obj;
        this.updateObj(val);
    }
    plusInput(val) {
        let obj = {};
        obj.type = val.type;
        obj.key = val.key;
        // console.log(val);
        if (obj.type == "array" || obj.type == "object"){
            if(this.maxDepth){
                if(this.maxDepth-1 <= val.card_n) {
                    console.log("ERROR: Max Depth is "+this.maxDepth)
                    return;
                }
            }
            obj.value = {type:obj.type, key:obj.key,inputs:[]};
            if(val.group) {
                // console.log(val.group);
                obj.value.inputs = val.group
            }
        } else if (obj.type == "int") {
            obj.value = 0;
        } else {
            obj.value = "";
        }
        // this.mainObject[val.card_n].inputs.push(obj)
        this.mainObject[val.card_n].inputs = this.mainObject[val.card_n].inputs.concat(obj);
    }
    setTypeToCard(val) {
        this.mainObject[val.card_n].type = val.type;
    }
    saveThisCard(val){
        this.saveCard(this.mainObject[val]);
        this.mainObject.splice(val, 1);
    }
    takeJsonFromObj(objs) {
        var jsn = {}
        //console.log(objs);
        if(objs.inputs) {
            var inputs = objs.inputs;
        } else {
            var inputs = objs.value.inputs;
        }
        
        inputs.forEach((obj) => {
            if (obj.type != "array" && obj.type != "object") {
                jsn[obj.key] = obj.value;
            }
            if (obj.type == "array") {
                let ret = this.takeJsonFromArr(obj)
                jsn[obj.key] = ret
            }
            if (obj.type == "object") {
                let ret = this.takeJsonFromObj(obj)
                jsn[obj.key] = ret
            }
          });
        //console.log(jsn);
        return jsn;
    }
    takeJsonFromArr(objs) {
        var jsn = []
        if(objs.inputs) {
            var inputs = objs.inputs;
        } else {
            var inputs = objs.value.inputs;
        }
        inputs.forEach((obj) => {
            if (obj.type != "array" && obj.type != "object") {
                // jsn.push(obj.value);
                jsn = jsn.concat(obj.value);
            }
            if (obj.type == "array") {
                let ret = this.takeJsonFromArr(obj)
                // jsn.push(ret)
                jsn = jsn.concat(ret);
            }
            if (obj.type == "object") {
                let ret = this.takeJsonFromObj(obj)
                // jsn.push(ret)
                jsn = jsn.concat(ret);
            }
        });
        //console.log(jsn);
        return jsn;
    }
    
    giveMeMyJSON() {
        var objs = this.mainObject;
        this.resetBeforeSave();
        objs.forEach((obj) => {
            if (obj.type == "object") {
                this.jsn = {}
                let ret = this.takeJsonFromObj(obj)
                this.jsn[obj.key] = ret;
            } else if(obj.type == "array") {
                this.jsn = []
                let ret = this.takeJsonFromArr(obj)
                // this.jsn.push(ret);
                this.jsn = this.jsn.concat(ret);
            }
        });

        return this.jsn;
        
    }
    saveJson(password) {
        let mainObj = this.mainObject
        // save .aje format for future editing in awesome-json-editor
        // save .json with result JSON information
        // let user use password and check it on backend if you need extra security
        let data = {
            aje: JSON.stringify(mainObj,  this.circularReplacer()),
            json: JSON.stringify(this.jsn),
            password: password
        };
        (async () => {
            const rawResponse = await fetch(this.saveUrl, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
            const urls = await rawResponse.json();
             
            // Based on your needs and backend logic, you can display this urls for user, redirect directly or even do nothing, just save this files on server
            this.ajeDownloadUrl = urls.aje
            this.jsonDownloadUrl = urls.json
            this.zipDownloadUrl = urls.zip

          })();
    }
    importAJE(aje){
        if (aje.lenght > 27) {
            this.mainObject = JSON.parse(aje)
        }
    }

    /* ACTIONS */

    // custom input types
    defineTypes() {
        this.allowedTypes = [
            "string",
            "int",
            "array",
            "object"
        ];
    }
    addType(type) {
        if(this.allowedTypes !== undefined) {
            // this.allowedTypes.push(type.type);
            this.allowedTypes = this.allowedTypes.concat(type.type);
            // this.objectGroups.all.push(type);
            this.objectGroups.all = this.objectGroups.all.concat(type);
        }
    }
    
    /* importDeny:
    [
        {
            group: "card-3" | "all" | "Key"
            type: "Image" | "_array"
        }
    ] 
    */
    denyTypes() {
        this.deniedTypes = {}
        if(this.allowActions) {
            if(this.importDeny) {
                for(var action in this.importDeny) {
                    this.addDeny(this.importDeny[action].group, this.importDeny[action].type)
                }
            }
        }
        /* example
        this.deniedTypes = {
            "card-0": [
                '"String"',
            ],
            "card-1": [
                "_image"
            ],
            "all": [
                "Int"
            ],
            "Ports": [
                "_object",
            ]
        };
        */
    }

    addDeny(group, data) {
        if(this.deniedTypes[group]) {
            // this.deniedTypes[group].push(data);
            this.deniedTypes[group] = this.deniedTypes[group].concat(data);
        } else {
            this.deniedTypes[group] = [data];
        }
    }

    // default objects for input types - groups
    defineGroups() {
        this.objectGroups = {
            "all": [
                {
                    name: '"String"',
                    type: "string"
                },
                {
                    name: "Int",
                    type: "int"
                },
                {
                    name: "Array [ ]",
                    type: "array"
                },
                {
                    name: "Object { }",
                    type: "object"
                },
            ]
        };
        
        /* example
        this.objectGroups["Ports"] = [
            {
                    // card
                    name: "Example Group 1",
                    type:"array",
                    key:"User",
                    inputs: [
                        {
                            type:"int",
                            key:"age",
                            value:24
                        },
                        {
                            type:"string",
                            key:"name",
                            value:"re"
                        },
                        {
                            type:"array",
                            key:"city",
                            value:{
                                // card
                                type:"array",
                                key:"city",
                                inputs: [
                                    {
                                        type:"int",
                                        key:"age",
                                        value:24
                                    }
                                ]
                            }
                        }
                    ]
            },
            {
                // group name to display
                name: "Example Group 2",
                // input type
                type: "object",
                // fixed key
                key: "example_group",
                // group starting (defualt) inputs
                inputs: [
                    {
                        type:"string",
                        key:"name",
                        value:"enter your name here"
                    },
                    {
                        type:"array",
                        key:"friends",
                        value: {
                            type:"array",
                            key:"friends",
                            inputs: [
                                {
                                    type:"string",
                                    value:"enter your name here"
                                },
                            ]
                        }
                    },
                ]
            },
        ];
        */
    }

    defineImportedGroups() {
        if(this.allowActions) {
            if(this.importGroups) {
                for(var action in this.importGroups) {
                    // console.log(action);
                    this.addInGroup(this.importGroups[action].group, this.importGroups[action].data)
                }
            }
        }
    }

    // group name: all, 
    addInGroup(group, data) {
        if(this.objectGroups[group]) {
            // this.objectGroups[group].push(data);
            this.objectGroups[group] = this.objectGroups[group].concat(data);
        } else {
            this.objectGroups[group] = [];
            this.objectGroups[group] = this.objectGroups[group].concat(data);
        }
    }

    /* END ACTIONS */



    /* CONFIGS */

    // max depth
    setMaxDepth(depth) {
        this.maxDepth = depth;
    }

    // try to fetch configs if configs not set
    getConfigs() {
        if(this.save === undefined) {
            if(this.configUrl) {
                this.get(this.configUrl).then((configs) => {
                    this.setConfigs(configs);
                });
            }
        }
    }

    // fetch aje if mainObject not set
    getMainObject() {
        if(!this.mainObject || Object.keys(this.mainObject).length === 0) {
            if(this.fetchUrl) {
                this.get(this.fetchUrl).then((data) => {
                    this.setMainObject(data);
                });
            }
        }
    }

    setMainObject(mainObject) {
        this.mainObject = mainObject;
    }

    // let able to import actions and denies from config
    allowCustomActions() {
        this.allowActions = true;
    }
    
    setConfigs(conf) {
        for (let index = 0; index < this.allowedConfigs.length; index++) {
            if(conf[this.allowedConfigs[index]] !== undefined) {
                this[this.allowedConfigs[index]] = conf[this.allowedConfigs[index]];
            }
        }
        
        // console.log(this);
        this.defineImportedGroups();
        this.denyTypes();
    }

    /* END CONFIGS */


    /* HELPERS */

    
    circularReplacer() {
        // need to avoid "TypeError: cyclic object value" error
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
            }
            return value;
        };
    }

    // create GET fetch helper function
    get(url) {
        
        let resp = (async () => {
            const rawResponse = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            const response = await rawResponse.json();

            return response;

          })();
          return resp
    }

    /* END HELPERS */


}


// test

let obj = new aje({
    save:"try",
});


obj.updateObj({
    card_n:0,inp:1,edited:"value",value:"revaz new"
})

obj.giveMeMyJSON();

// console.log(obj);