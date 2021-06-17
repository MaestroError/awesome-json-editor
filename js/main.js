const app = Vue.createApp({
    data() {
        return {
            mainObject: [
                {
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
            ],

            jsn: [],
            show: false
        }
    },
    methods: {
        objToArray($object) {
            var result = Object.values($object);
            $object = result;
            return $object
        },
        arrayToObj($array) {
            var result = Object.assign({}, $array);
        },
        addEl($object, $el, $key="") {
            if (Array.isArray($object)) {
                $object.push($el);
            }
            if(typeof $object === 'object') {
                $object[$key] = $el;
            }
        },
        updateObj(val) {
            // set object value by coordinates
            //console.log(val)
            this.mainObject[val.card_n].inputs[val.inp][val.edited] = val.value;
            if (this.mainObject[val.card_n].inputs[val.inp].type == "array" || this.mainObject[val.card_n].inputs[val.inp].type == "object") {
                if (val.edited == "key") {
                    this.mainObject[val.card_n].inputs[val.inp].value.key = val.value;
                }
                this.mainObject[val.card_n].inputs[val.inp].type = val.value.type
            }
        },
        removeInput(val) {
            this.mainObject[val.card_n].inputs.splice(val.inp, 1);
        },
        addNewCard(val) {
            this.mainObject.push(val);
        },
        resetCards(val) {
            console.log(val);
            let cardIndex = val.childOf.card_n;
            let len = this.mainObject.length-1;
            
            for (let i = len; i > cardIndex; i--) {
                this.saveCard(this.mainObject[i]);
                this.mainObject.splice(i, 1);
            }
            this.addNewCard(val);
        },
        resetBeforeSave() {;
            let cardIndex = 0;
            let len = this.mainObject.length-1;
            
            for (let i = len; i > cardIndex; i--) {
                this.saveCard(this.mainObject[i]);
                this.mainObject.splice(i, 1);
            }
        },
        saveCard(obj){
            let val = obj.childOf;
            val.value = obj;
            this.updateObj(val);
        },
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
        },
        setTypeToCard(val) {
            this.mainObject[val.card_n].type = val.type;
        },
        saveThisCard(val){
            this.saveCard(this.mainObject[val]);
            this.mainObject.splice(val, 1);
        },
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
        },
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
        },
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
            //console.log(JSON.stringify(this.jsn));
            this.show=true;
        },
        editMode() {
            this.show=false;
        }
        
    },
    created() {
        fetch("/js/test.json")
        .then(response => {
        return response.json();
        })
        .then(data => this.auctions = data.auctions);
    }
})
