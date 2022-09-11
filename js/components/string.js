app.component('string', {
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
    },
    denyDelete: {
      type: Boolean,
    }
  },
  emits: ["update_value", "remove_input"],
  template: 
  /*html*/
  `<li v-if="type == 'array'" class="list-item">
      <textarea rows="3" class="text-sm text-green-700 bg-gray-200 p-2 my-1 rounded-md hover:bg-white w-48 h-16" v-on:input="updateValue($event.target.value)">{{value}}</textarea>
      <img v-if="removable && !denyDelete" src="images/trash.png" @click="removeInput" class="trash p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">
    </li>
    <li v-else-if="type == 'object'" class="list-item my-2 mx-2">
      <input class="key text-sm text-green-600  bg-gray-200 p-2  rounded-md hover:bg-white" type="text" placeholder="key" :value="keyObj" v-on:input="updateKey($event.target.value)"> : 
      <textarea rows="3" class="text-sm text-green-700 bg-gray-200 p-2 my-1 rounded-md hover:bg-white w-44 h-16" v-on:input="updateValue($event.target.value)">{{value}}</textarea>
      <img v-if="removable && !denyDelete" src="images/trash.png" @click="removeInput" class="trash p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">
    </li>`,


  data() {
    return {
        test: 'da'
    }
  },
  methods: {
    removeInput() {
        this.$emit('remove_input')
      },
    updateValue: function (value) {
        this.$emit('update_value', {value:value, edited:"value"})
      },
    updateKey: function (value) {
        this.$emit('update_value', {value:value, edited:"key"})
      }
  },
  computed: {
      title() {
          return this.brand + ' ' + this.product
      }
  }
})