
## vue-dropzone

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
    <button @click="onClick">open</button>
  </div>
</template>

<script>
import { useDropzone } from 'vue3-dropzone'
export default {
  name: 'UseDropzoneDemo',
  setup() {
    const {
      getRootProps,
      getInputProps,
      ...rest
    } = useDropzone(options)
    return {
      getRootProps,
      getInputProps,
      ...rest
    }
  }
}
</script>
```