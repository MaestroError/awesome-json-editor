const app = Vue.createApp({
    data() {
        return {
            aje: "",

            password: "YourPassword",
            configObj: {},
            show: false,
            importedAJE: [],
            // main configs
            // allowImport: false,
            // save: false,
            // saveUrl: "data/save.json",
            // fetchUrl: "data/data.aje",
            // configUrl: "data/config.json",
            // canImport: false,

            jsonDownloadUrl: "",
            ajeDownloadUrl: "",
            zipDownloadUrl: ""
        }
    },
    methods: {
        addEl($object, $el, $key="") {
            if (Array.isArray($object)) {
                $object.push($el);
            }
            if(typeof $object === 'object') {
                $object[$key] = $el;
            }
        },
        updateObj(val) {
            this.aje.updateObj(val);
        },
        removeInput(val) {
            this.aje.removeInput(val);
        },
        addNewCard(val) {
            this.aje.addNewCard(val);
        },
        resetCards(val) {
            // console.log(this.objectGroups);
            this.aje.resetCards(val);
        },
        resetBeforeSave() {
            this.aje.resetBeforeSave();
        },
        saveCard(obj){
            this.aje.resetBeforeSave(obj);
        },
        plusInput(val) {
            this.aje.plusInput(val);
        },
        setTypeToCard(val) {
            this.aje.setTypeToCard(val);
        },
        saveThisCard(val){
            this.aje.saveThisCard(val);
        },
        takeJsonFromObj(objs) {
            this.aje.saveThisCard(objs);
        },
        takeJsonFromArr(objs) {
            this.aje.saveThisCard(objs);
        },
        editMode() {
            this.show=false;
        },
        giveMeMyJSON() {
            this.aje.giveMeMyJSON();

            if (!this.save) {
                this.show=true;
            } else {
                this.saveJson();
            }
            
        },
        saveJson(password) {
            this.aje.saveJson(password);
        },
        importAJE(){
            this.allowImport=true;
            this.canImport = false;
        },
        editAJE() {
            this.aje.importAJE(this.importedAJE);
            this.allowImport=false;
            this.canImport = true;
        },
        setConfigs(conf) {
            this.aje.setConfigs(conf);
        }
        
    },
    created() {
        this.aje = new aje({
            save: false,
            saveUrl: "data/save.json",
            fetchUrl: "data/data.aje",
            configUrl: "data/config.json",
            canImport: false,
            allowImport: false,
            // maximum depth of json objects
            maxDepth: 3,
            // deny deleting some objects
            denyDelete: [
                "Ports",
                // "all"
            ],
            // allows to import custom actions and denies
            allowActions: true,
            importDeny: [
                {
                    group:"all",
                    type:"_array"
                }
            ],
            importGroups: [
                {
                    group:"all",
                    data: {
                        name: "Example Group 1",
                        type: "object",
                        key: "User",
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
                },
                {
                    group:"all",
                    data: {
                        name: "Products",
                        type: "object",
                        key: "Prod",
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
                },
            ]
        });
        
        // this.aje = new aje({}, "data/config.json", "data/data.aje", true);
        // this.aje.getMainObject();

        this.aje.addType({
            name: "Image",
            type: "image"
        }),
        console.log(this.denyDelete);
    },
    computed: {
        mainObject() {
            return this.aje.mainObject
        },
        jsn() {
            return this.aje.jsn
        },
        save() {
            return this.aje.save
        },
        canImport() {
            return this.aje.canImport
        },
        allowImport() {
            return this.aje.allowImport
        },
        allowedTypes() {
            return this.aje.allowedTypes
        },
        denyTypes() {
            return this.aje.deniedTypes
        },
        objectGroups() {
            return this.aje.objectGroups
        },
        denyDelete() {
            return this.aje.denyDelete
        }
    }
})
