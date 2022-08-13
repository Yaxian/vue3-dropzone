<template>
  <div>
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()">
      <p v-if="isDragActive">Drop the files here ...</p>
      <p v-else>Drag 'n' drop some files here, or click to select files</p>
      <div v-if="isFocused" id="focus">
        focused
      </div>
      <div v-if="isDragReject" id="isDragReject">
        isDragReject: {{ isDragReject }}
      </div>
    </div>
    <button @click="open">open</button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useDropzone } from 'vue3-dropzone/src'
import type { FileRejectReason } from 'vue3-dropzone/src/useDropzone'

function onDrop(acceptedFiles: File[], rejectReasons: FileRejectReason[]) {
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
  isDragActive,
  isFocused,
  isDragReject,
  open
} = useDropzone(options)


</script>
