app.component('jsobject', {
  props: {
    type: {
      type: String,
      required: true
    },
    keyObj: {
      type: String
    },
    value: {
    },
    removable: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update_value", "remove_input", "addCard"],
  template: 
  /*html*/
  `<li v-if="type == 'array'" class="list-item my-2">
      <span @click="addCard(value, 'value')" class="text-sm text-green-900 bg-gray-400 p-2 rounded-md hover:bg-white cursor-pointer">{ object }</span>
      <img v-if="removable" src="images/trash.png" @click="removeInput" class="trash p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">
    </li>
    <li v-else-if="type == 'object'" class="list-item text-sm text-green-900 mx-2 my-1 rounded-md  cursor-pointer">
      <input class="key text-sm bg-gray-400 p-2 rounded-md hover:bg-white" type="text" placeholder="key" :value="keyObj" v-on:input="updateKey($event.target.value, 'key')"> : 
      <span @click="addCard(value, 'value')" class="hover:bg-white bg-gray-400 rounded-md p-2 cursor-pointer">{ object }</span>
      <img v-if="removable" src="images/trash.png" @click="removeInput" class="trash p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">
    </li>`,


  data() {
    return {
        product: 'Socks'
    }
  },
  methods: {
    removeInput() {
      this.$emit('remove_input')
      },
    updateKey: function (value) {
        this.$emit('update_value', {value:value, edited:"key"})
      },
    addCard(value, name){
      // console.log(value);
        value.childOf = {edited:name};
        this.$emit('addCard', value);
      },
  },
  computed: {
      title() {
          return this.brand + ' ' + this.product
      }
  }
})