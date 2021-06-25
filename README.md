# vue3-dropzone

It's inspired by [react-dropzone](https://github.com/react-dropzone/react-dropzone) and implemented with vue3.

<br>
<br>

# Run example

```
cd examples
yarn install
yarn dev
```

<br>
<br>

# How to use

Basic use with flexibility. `acceptFiles` is an array returned in the same format as [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList) where all the dropped files are turned into a [File class](https://developer.mozilla.org/en-US/docs/Web/API/File) before saving to the array.
<br>
<br>

```vue
<template>
  <div>
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()" />
      <p v-if="isDragActive">Drop the files here ...</p>
      <p v-else>Drag 'n' drop some files here, or click to select files</p>
    </div>
    <button @click="open">open</button>
  </div>
</template>

<script>
import { useDropzone } from "vue3-dropzone";

export default {
  name: "UseDropzoneDemo",
  setup() {
    function onDrop(acceptFiles, rejectReasons) {
      console.log(acceptFiles);
      console.log(rejectReasons);
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });

    return {
      getRootProps,
      getInputProps,
      ...rest,
    };
  },
};
</script>
```

<br>
<br>

# Save multiple files

Save multiple files through [axios requests](https://github.com/axios/axios) and [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData). You will need a backend to loop through the received files and save them individually in the loop.
<br>
<br>

```vue
<template>
  <div>
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()" />
      <p v-if="isDragActive">Drop the files here ...</p>
      <p v-else>Drag 'n' drop some files here, or click to select files</p>
    </div>
    <button @click="open">open</button>
  </div>
</template>

<script>
import { useDropzone } from "vue3-dropzone";
import axios from "axios";

export default {
  name: "UseDropzoneDemo",
  setup() {
    const url = "{your_url}"; // Your url on the server side
    const saveFiles = (files) => {
      const formData = new FormData(); // pass data as a form
      for (var x = 0; x < files.length; x++) {
        // append files as array to the form, feel free to change the array name
        formData.append("images[]", files[x]);
      }

      // post the formData to your backend where storage is processed. In the backend, you will need to loop through the array and save each file through the loop.

      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.info(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    function onDrop(acceptFiles, rejectReasons) {
      saveFiles(acceptFiles); // saveFiles as callback
      console.log(rejectReasons);
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });

    return {
      getRootProps,
      getInputProps,
      ...rest,
    };
  },
};
</script>
```



<br>
<br>

# Recive file data & save as vue variable

Recive file data and use the data in the template, example is with CSV.
<br>
<br>


```vue
<template>
  <div>
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()" />
      <p v-if="isDragActive">Drop the files here ...</p>
      <p v-else>Drag 'n' drop some files here, or click to select files</p>
    </div>
    <button @click="open">open</button>
  </div>
</template>

<script>
import { useDropzone } from "vue3-dropzone";
import axios from "axios";

export default {
  name: "UseDropzoneDemo",
  data() {
      let state = this;
      const { getRootProps, getInputProps } = useDropzone({
          onDrop,
      });
      function onDrop(acceptFiles, rejectReasons) {
          console.log(acceptFiles);
          console.log(rejectReasons);
          state.saveFiles(acceptFiles);
      }
      return {
          data: [],
          getRootProps,
          getInputProps,
      };
  },
  methods() {
    saveFiles(files){
      const url = "{your_url}"; // Your url on the server side
      const formData = new FormData(); // pass data as a form
      for (var x = 0; x < files.length; x++) {
        // append files as array to the form, feel free to change the array name
        formData.append("images[]", files[x]);
      }

      // post the formData to your backend where storage is processed. In the backend, you will need to loop through the array and save each file through the loop.

      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.info(response.data);
          this.data = response.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
```
