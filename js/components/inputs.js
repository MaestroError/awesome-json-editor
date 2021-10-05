app.component('inputs', {
  props: {
    cardType: {
      type: String,
      required: true
    },
    inputType: {
      type: String,
      required: true
    },
    keyObj: {
      type: String
    },
    value: {
    },
    inp: {
      type: Number,
      required: true
    },
    removable: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update_val", "new_card", "remove_input", "reset_actions"],
  template: 
  /*html*/
  `
  <string v-if="inputType == 'string'" 
  :type="cardType" :keyObj="keyObj" :value="value" :removable="removable"
   @update_value="updateVal" @remove_input="remove"></string>

  <int v-if="inputType == 'int'" 
  :type="cardType"  :keyObj="keyObj" :value="value" :removable="removable"
   @update_value="updateVal" @remove_input="remove"></int>

  <array v-if="inputType == 'array'" 
  :type="cardType"  :keyObj="keyObj" :value="value" :removable="removable"
   @addCard="newCard" @update_value="updateVal" @remove_input="remove"></array>

  <jsobject v-if="inputType == 'object'" 
  :type="cardType"  :keyObj="keyObj" :value="value" :removable="removable"
   @addCard="newCard" @update_value="updateVal" @remove_input="remove"></jsobject>

   <image_input v-if="inputType == 'image'" 
   :type="cardType" :keyObj="keyObj" :value="value" :removable="removable"
    @update_value="updateVal" @remove_input="remove"></image_input>
   `,


  data() {
    return {
    }
  },
  methods: {
      updateVal(val) {
          this.$emit('update_val', {value:val.value, inp:this.inp, edited:val.edited})
      },
      newCard(val){
        val.childOf.inp = this.inp;
        this.$emit('new_card', val)
      },
      remove(){
        this.$emit('remove_input', {inp:this.inp})
      }
  },
  created() {
  },
  computed: {
      title() {
          return this.brand + ' ' + this.product
      }
  }
})