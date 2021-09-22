class aje {

    constructor(conf) {
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
        this.setConfigs(conf);
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
        console.log(val)
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

    removeInput(val) {
        this.mainObject[val.card_n].inputs.splice(val.inp, 1);
    }
    addNewCard(val) {
        this.mainObject.push(val);
    }
    resetCards(val) {
        console.log(val);
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
        if (obj.type == "array" || obj.type == "object"){
            obj.value = {type:obj.type, key:obj.key,inputs:[]};
        } else if (obj.type == "int") {
            obj.value = 0;
        } else {
            obj.value = "";
        }
        this.mainObject[val.card_n].inputs.push(obj)
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
            if (obj.type == "string" || obj.type == "int") {
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
            if (obj.type == "string" || obj.type == "int") {
                jsn.push(obj.value);
            }
            if (obj.type == "array") {
                let ret = this.takeJsonFromArr(obj)
                jsn.push(ret)
            }
            if (obj.type == "object") {
                let ret = this.takeJsonFromObj(obj)
                jsn.push(ret)
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
                this.jsn.push(ret);
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
             
            // Based on your needs and backend logic, you can diplay this urls for user, redirect directly or even do nothing, just save this files on server
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
    setConfigs(conf) {
        this.save = conf.save
        this.saveUrl = conf.saveUrl
        this.fetchUrl = conf.fetchUrl
        this.configUrl = conf.configUrl
        this.allowImport = conf.allowImport
    }
}

let obj = new aje({
    save:"",
    saveUrl:"",
    fetchUrl:"",
    configUrl:"",
    allowImport:"",
});


obj.updateObj({
    card_n:0,inp:1,edited:"value",value:"revaz new"
})

obj.giveMeMyJSON();

console.log(obj);