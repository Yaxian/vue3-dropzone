<template>
  <div>
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()" >
      <p v-if="isDragActive">Drop the files here ...</p>
      <p v-else>Drag 'n' drop some files here, or click to select files</p>
      <div v-if="isFocused" id="focus">
        focused
      </div>
      <div v-if="isDragReject" id="isDragReject">
        isDragReject: {{ isDragReject }}
      </div>
    </div>
    <button @click="onClick">open</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useDropzone } from 'vue3-dropzone/src'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    onClick() {
      if (this.open) {
        this.open()
      }
    },
    toggleMulti() {
      this.options.multiple = !this.options.multiple
    }
  },
  setup() {
    function onDrop(acceptedFiles, rejectReasons) {
      console.log('acceptedFiles', acceptedFiles)
      console.log('rejectReasons', rejectReasons)
    }

    const options = reactive({
      multiple: false,
      onDrop,
      accept: '.jpg',
    })

    const {
      getRootProps,
      getInputProps,
      ...rest
    } = useDropzone(options)
    return {
      options,
      getRootProps,
      getInputProps,
      ...rest
    }
  }
})
</script>
