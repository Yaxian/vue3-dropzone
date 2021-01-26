
## vue3-dropzone

It's inspired by [react-dropzone](https://github.com/react-dropzone/react-dropzone) and implemented with vue3.

## Run example

```
cd examples
yarn install
yarn dev
```

### How to use

```vue
<template>
  <div>
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()" >
      <p v-if="isDragActive">Drop the files here ...</p>
      <p v-else>Drag 'n' drop some files here, or click to select files</p>
    </div>
    <button @click="open">open</button>
  </div>
</template>

<script>
import { useDropzone } from 'vue3-dropzone'
export default {
  name: 'UseDropzoneDemo',
  setup() {
    function onDrop(acceptFiles, rejectReasons) {
      console.log(acceptFiles)
      console.log(rejectReasons)
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })

    return {
      getRootProps,
      getInputProps,
      ...rest
    }
  }
}
</script>
```