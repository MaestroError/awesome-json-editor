app.component('image_input', {
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
      <input v-if="!image" type="file" class="imageInput text-sm text-green-700 bg-gray-200 p-2 my-1 rounded-md hover:bg-white h-16" v-on:change="updateValue($event.target)" accept="image/*">
      <img v-if="image" :src="image" @click="changeImage" class="imagePrew w-8 p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">

      <img v-if="removable && !denyDelete" src="images/trash.png" @click="removeInput" class="trash p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">
    </li>
    <li v-else-if="type == 'object'" class="list-item my-2">
      <input class="key text-sm text-green-600  bg-gray-200 p-2  rounded-md hover:bg-white" type="text" placeholder="key" :value="keyObj" v-on:input="updateKey($event.target)"> : 
      <input v-if="!image" type="file" class="imageInput text-sm text-green-700 bg-gray-200 p-2 my-1 rounded-md hover:bg-white w-48 h-16" v-on:change="updateValue($event.target)" accept="image/*">
      <img v-if="image" :src="image" @click="changeImage" class="imagePrew w-8 p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">

      <img v-if="removable && !denyDelete" src="images/trash.png" @click="removeInput" class="trash p-1 bg-blue-100 hover:bg-blue-300 cursor-pointer ml-2" alt="">
    </li>`,


  data() {
    return {
        image: false
    }
  },
  methods: {
    removeInput() {
        this.$emit('remove_input')
      },
    updateValue: function (target) {
      console.log(target);
        this.getBase64(target.files[0]);
        
      },
    updateKey: function (value) {
        this.$emit('update_value', {value:value, edited:"key"})
      },
    getBase64(file) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            this.image = reader.result;
            this.$emit('update_value', {value:this.image, edited:"value"});
        };
    },
    changeImage() {
      this.image = false;
      this.$emit('update_value', {value:"", edited:"value"});
    }
  },
  created() {
    this.image = this.value;
  },
  computed: {
      title() {
          return this.brand + ' ' + this.product
      }
  }
})