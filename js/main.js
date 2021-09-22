const app = Vue.createApp({
    data() {
        return {
            aje: "",

            password: "YourPassword",
            configObj: {},
            show: false,
            importedAJE: [],
            allowImport: false,
            // main configs
            save: false,
            saveUrl: "data/save.json",
            fetchUrl: "data/data.aje",
            configUrl: "data/config.json",
            canImport: false,

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
            save:"",
            saveUrl:"",
            fetchUrl:"",
            configUrl:"",
            allowImport:"",
        })
    },
    computed: {
        mainObject() {
            return this.aje.mainObject
        },
        jsn() {
            return this.aje.jsn
        }
    }
})
