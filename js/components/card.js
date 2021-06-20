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
      }
    },
    emits: ['save_card','update_card', 'plus_card', 'plus_input', 'remove_input_from_card', 'set_type'],
    template: 
    /*html*/
    `<div class="list-card flex flex-col shadow-md p-2 rounded mr-3" style="flex: 0 0 16rem;">

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
      :removable="removable"></inputs>
    </ul>

    <div class="actions">
      <hr class="mb-3 mx-2">
      <button @click="addElement('object')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">Object { }</button>
      <button @click="addElement('array')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">Array [ ]</button>
      <button @click="addElement('string')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">"String"</button>
      <button @click="addElement('int')" class="text-xs text-white py-1 my-1 px-2 rounded bg-blue-400 hover:text-lg hover:bg-blue-500 font-bold mx-1">int</button>
    </div>

  </div>`,


    data() {
      return {
        test: []
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
          this.$emit('plus_card', val);
        },
        addElement(type) {
          let val = {};
          val.card_n = this.card_n;
          val.type = type;
          val.key = "key_"+Math.random().toString(16).substr(2, 3);
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
        }
    },
    computed: {
        testing() {
            return this.cardInputs = this.inputs
        }
    }
  })