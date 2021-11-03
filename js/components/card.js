app.component('card', {
    props: {
      type: {
        type: String,
        required: true
      },
      card_key: {
        type: String
      },
      inputs: {
        type: Array,
        required: true
      },
      card_n: {
        type: Number,
        required: true
      },
      removable: {
        type: Boolean,
        required: true
      },
      types: {
        type: Object,
        required: true
      },
      deny: {
        type: Object,
        required: true
      },
      groups: {
        type: Object,
      },
      deny_delete: {
      }
    },
    emits: ['save_card','update_card', 'plus_card', 'plus_input', 'remove_input_from_card', 'set_type'],
    template: 
    /*html*/
    `<div class="list-card flex flex-col shadow-md p-2 rounded mr-3" style="flex: 0 0 17rem;">

      <h3 v-if="type == 'object'" class="list-type text-lg p-2">
        <span> Object { "{{card_key}}" } </span>
        <span @click="setTo('array')" class="change-type text-gray-300 hover:text-gray-400 text-xs mx-2 cursor-pointer">Array [ ]</span>
        <img v-if="card_n != 0 && removable" @click="saveCard" src="images/save.png" class="save p-1 hover:bg-green-300 cursor-pointer ml-2" alt="">
      </h3>
      <h3 v-else-if="type == 'array'" class="list-type text-lg p-2">
        <span > Array [ ] </span>
        <span @click="setTo('object')" class="change-type text-gray-300 hover:text-gray-400 text-xs mx-2 cursor-pointer">object { }</span>
        <img v-if="card_n != 0 && removable" @click="saveCard" src="images/save.png" class="save p-1 hover:bg-green-300 cursor-pointer ml-2" alt="">
      </h3>

    <hr class="mx-2">

    <ul class="list flex flex-1 items-start flex-col overflow-y-auto py-2" @click="log">
      <inputs v-for="(input, index) in inputs" 
      :cardType="type" 
      :inp="index" 
      :key="index" 
      :inputType="input.type" 
      :keyObj="input.key" 
      :value="input.value" 
      @update_val="updateCard"
      @new_card="plusCard"
      @remove_input="remove_input"
      :removable="removable"
      @reset_actions = "resetTypes"
      :denyDel="allowDelete"
      ></inputs>
    </ul>

    <div class="actions">
      <hr class="mb-3 mx-2">
      <!--
      <button @click="addElement('object')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">Object { }</button>
      <button @click="addElement('array')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">Array [ ]</button>
      <button @click="addElement('string')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">"String"</button>
      <button @click="addElement('int')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">int</button>
      -->

      <div v-if="calcTypes">
        <button v-for="type in calcTypes" @click="addElement(type.type, type.key, type.inputs)" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">
          {{type.name}}
        </button>
      </div>

      <div v-if="cardTypes">
        <button v-for="type in cardTypes" @click="addElement(type.type, type.key, type.inputs)" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">
          {{type.name}}
        </button>
      </div>
      
      <div v-if="deptTypes">
        <button v-for="type in deptTypes" @click="addElement(type.type, type.key, type.inputs)" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">
          {{type.name}}
        </button>
      </div>

    </div>

  </div>`,


    data() {
      return {
        test: [],
        // calcTypes: {},
        deptTypes: {},
        cardTypes: {},
      }
    },
    methods: {
        log() {
            //console.log(this.inputs);
        },
        updateCard(val) {
          this.$emit('update_card', {value:val.value, inp:val.inp, card_n:this.card_n, edited:val.edited});
        },
        plusCard(val) {
          val.childOf.card_n=this.card_n;
          setTimeout(() => {
            // this.calcTypes = this.checkTypes(this.actions);
          }, 1000);
          this.$emit('plus_card', val);
        },
        addElement(type, key=false, group = false) {
          let val = {};
          val.card_n = this.card_n;
          val.type = type;
          if(!key) {
            val.key = "key_"+Math.random().toString(16).substr(2, 3);
          } else {
            val.key = key
          }

          // console.log(group);
          if(group) {
            val.group=JSON.parse(JSON.stringify(group));
          }
          
          this.$emit('plus_input', val);
        },
        remove_input(val) {
          val.card_n=this.card_n;
          this.$emit('remove_input_from_card', val);
        },
        setTo(type) {
          let val = {};
          val.card_n=this.card_n;
          val.type = type;
          this.$emit('set_type', val);
        },
        saveCard() {
          this.$emit('save_card', this.card_n);
        },
        calculateTypes(types, key) {
          if(!types) {
            return
          }
          // console.log(key);
          const calcTypes = [ ...types ];
          if(this.deny[key]) {
            for(var keyin in this.deny[key]) {
              if(this.deny[key][keyin].startsWith("_")) {
                let index = -2;
                // check for all indexes
                while(index !== -1) {
                  index = calcTypes.findIndex(x => x.type === this.deny[key][keyin].slice(1));
                  if(index > -1) {
                    calcTypes.splice(index, 1);
                  }
                }
              } else {
                let index = calcTypes.findIndex(x => x.name === this.deny[key][keyin]);
                if(index !== -1) {
                  calcTypes.splice(index, 1);
                }
              }
              // FROM OBJECT
              // if (calcTypes[this.deny[key][keyin]]) {
              //   delete calcTypes[this.deny[key][keyin]]
              // }
            }
          }
          return calcTypes
        },
        checkTypes(types) {
          let actions = this.calculateTypes(types, "all");
          key1 = "card-"+this.card_n;
          let actions1 = this.calculateTypes(actions, key1);
          let actions2 = this.calculateTypes(actions1, this.card_key);
          return actions2;
        },
        resetTypes(){
          let objects = this.groups['card-'+this.card_n]
          let objects1 = this.groups[this.card_key]
          this.actions = this.groups.all.concat(objects).concat(objects1).filter(e => e !== undefined);
          this.calcTypes = this.checkTypes(this.actions);
        },
        checkDelete() {
          if(this.deny_delete) {
            if(this.deny_delete.indexOf("all") !== -1 || this.deny_delete.indexOf("card-"+this.card_n-1) !== -1 || this.deny_delete.indexOf(this.card_key) !== -1){
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        }
    },
    renderTracked() {
      // this.calcTypes = this.checkTypes(this.groups.all);
      // this.deptTypes = this.checkTypes(this.groups['card-'+this.card_n]);
      // this.cardTypes = this.checkTypes(this.groups[this.card_key]);
    },
    created() {
        // this.allowDelete = this.checkDelete();
    },
    computed: {
      calcTypes() {
        let objects = this.groups['card-'+this.card_n]
        let objects1 = this.groups[this.card_key]
        this.actions = this.groups.all.concat(objects).concat(objects1).filter(e => e !== undefined);
        return this.checkTypes(this.actions);
      },
      allowDelete() {
        if(this.deny_delete) {
          if(this.deny_delete.indexOf("all") !== -1 || this.deny_delete.indexOf("card-"+this.card_n-1) !== -1 || this.deny_delete.indexOf(this.card_key) !== -1){
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }
  })