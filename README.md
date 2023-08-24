# vue3-dropzone

It's inspired by [react-dropzone](https://github.com/react-dropzone/react-dropzone) and implemented with vue3.


### Installation

```
npm install --save vue3-dropzone
```
or

```
yarn add vue3-dropzone
```

### Usage

Basic use with flexibility. `acceptFiles` is an array returned in the same format as [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList) where all the dropped files are turned into a [File class](https://developer.mozilla.org/en-US/docs/Web/API/File) before saving to the array.

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

## ☕️
Could you buy me a coffee, if my effort save your time?

| 微信(Wechat) | 支付宝(alipay) |
| --- | --- |
| <img src="./docs/buy_coffee_wechat.jpg" width="150px" height="150px" > | <img src="./docs/buy_coffee_alipay.jpg"  width="150px" height="150px" > |


### API

```js
const result = useDropzone(options)
```

`options`
---
| property | type | description |
|----------|------|-------------|
| onDrop | Function | Cb for when the drop event occurs. Note that this callback is invoked after the getFilesFromEvent callback is done. |
| accept | String / Array<*String*>  | Set accepted file types. See https://github.com/okonet/attr-accept for more information. |
| disabled | Boolean | Enable/disable the dropzone |
| maxSize | Number | Maximum file size (in bytes) |
| minSize | Number | Minimum file size (in bytes) |
| multiple | Number | Allow of multiple files |
| maxFiles | Number | Maximum accepted number of files The default value is 0 which means there is no limitation to how many files are accepted |
| getFilesFromEvent | Function | Use this to provide a custom file aggregator |
| onDragenter | Function | Cb for when the dragenter event occurs. |
| onDragover | Function | Cb for when the dragover event occurs |
| onDragleave | Function | Cb for when the dragleave event occurs |
| onDropAccepted | Function | Cb for when the drop event occurs. Note that if no files are accepted, this callback is not invoked. |
| onDropRejected | Function | Cb for when the drop event occurs. Note that if no files are rejected, this callback is not invoked. |
| onFileDialogCancel | Function | Cb for when closing the file dialog with no selection |
| preventDropOnDocument | Boolean | If `false`, allow dropped items to take over the current browser window |
| noClick | Boolean | If `true`, disables click to open the native file selection dialog |
| noKeyboard | Boolean | If `true`, disables SPACE/ENTER to open the native file selection dialog. Note that it also stops tracking the focus state. |
| noDrag | Boolean | If `true`, disables drag 'n' drop |
| noDragEventsBubbling | Boolean | If `true`, stops drag event propagation to parents |

`result`
---
| property | type | description |
|----------|------|-------------|
| isFocused | Ref<*Boolean*> |             |
| isFileDialogActive | Ref<*Boolean*> |             |
| isDragActive | Ref<*Boolean*> |             |
| isDragAccept | Ref<*Boolean*> |             |
| isDragReject | Ref<*Boolean*> |  |
| draggedFiles | Ref<*Array*> | dragged files |
| acceptedFiles | Ref<*Array*> |  accepted files |
| fileRejections | Ref<*Array*> | files rejections |
| getRootProps | Function | Function to generate element props which contains input |
| getInputProps | Function | Function to generate input props |
| rootRef | Ref<*HTMLElement*> | ref a dom element |
| inputRef | Ref<*HTMLElement*> | ref a input element |
| open | Function | Open file selection dialog |

### Run example

```
cd examples
yarn install
yarn dev
```

