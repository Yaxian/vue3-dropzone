import { reactive } from 'vue'
import { render, fireEvent, waitFor } from '@testing-library/vue'
import { useDropzone, FileUploadOptions } from '../useDropzone'

function createFile(name: string, size: number, type: string) {
  const file = new File([], name, { type })
  Object.defineProperty(file, 'size', {
    get() {
      return size
    },
  })
  return file
}

async function flushPromises(rerender: any, ui: any) {
  await waitFor(() => rerender(ui))
}

function createDtWithFiles(files: any[] = []) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  }
}

function createTestComponent(
  opt: Partial<FileUploadOptions> = {}, otherCmp = {}, rootProps = {}, inputProps = {},
) {
  return {
    setup() {
      const options = opt
      const {
        getRootProps, getInputProps, isDragActive, rootRef, inputRef, open,
        ...rest
      } = useDropzone(options)
      return {
        getRootProps,
        getInputProps,
        isDragActive,
        rootRef,
        inputRef,
        open,
        options,
        rootProps,
        inputProps,
        rest,
      }
    },
    template: `
      <div v-bind="getRootProps(rootProps)">
        <input v-bind="getInputProps(inputProps)" >
        <div v-if="rest.isFocused.value" id="focus">
          focused
        </div>
      </div>
    `,
    ...otherCmp,
  }
}

describe('useFileUpload() hook', () => {
  let files: any = []
  let images: any = []
  beforeEach(() => {
    files = [createFile('file1.pdf', 1111, 'application/pdf')]
    images = [createFile('cats.gif', 1234, 'image/gif'), createFile('dogs.gif', 2345, 'image/jpeg')]
  })

  afterEach(() => {
    files = []
    images = []
  })

  describe('behavior', () => {
    test('sets {accept, multiple} props on then <input>', () => {
      const accept = 'image/jpeg'
      const TestCmp = createTestComponent({ multiple: true, accept })
      const { container } = render(TestCmp)
      const input = container.querySelector('input')

      expect(input).toHaveAttribute('accept', accept)
      expect(input).toHaveAttribute('multiple', '')
    })

    test('updates {accept, multiple} on when it changes', async () => {
      const accept = 'image/jpeg'
      const options = reactive({ multiple: true, accept })
      const TestCmp = createTestComponent(options)
      const { container, rerender } = render(TestCmp)
      let input = container.querySelector('input')
      expect(input).toHaveAttribute('accept', accept)
      expect(input).toHaveAttribute('multiple', '')

      options.accept = 'image/png'
      options.multiple = false
      await rerender({})
      input = container.querySelector('input')
      expect(input).toHaveAttribute('accept', 'image/png')
      expect(input).not.toHaveAttribute('multiple')
    })

    test('sets any props passed to the input props getter on the <input>', () => {
      const options = reactive({})
      const name = 'beer-boger'
      const TestCmp = createTestComponent(options, {
        template: `
          <div v-bind="getRootProps()">
            <input v-bind="getInputProps({ name: '${name}' })" >
          </div>
        `,
      })
      const { container } = render(TestCmp)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('name', name)
    })

    test('sets any props passed to the root props getter on the root node', () => {
      const options = reactive({})
      const ariaLabel = 'Dropzone area'
      const TestCmp = createTestComponent(options, {
        template: `
          <div v-bind="getRootProps({ 'aria-label': '${ariaLabel}' })">
            <input v-bind="getInputProps()" >
          </div>
        `,
      })
      const { container } = render(TestCmp)
      const dropzone = container.querySelector('div')
      expect(dropzone).toHaveAttribute('aria-label', ariaLabel)
    })

    test('runs the custom callback handlers provided to the root props getter', async () => {
      const event = createDtWithFiles(files)

      const rootProps = {
        onClick: jest.fn(),
        onKeydown: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onDragenter: jest.fn(),
        onDragover: jest.fn(),
        onDragleave: jest.fn(),
        onDrop: jest.fn(),
      }

      const options = reactive({})
      const TestCmp = createTestComponent(options, {}, rootProps)

      const { container, rerender } = render(TestCmp)

      const dropzone = container.querySelector('div') as HTMLDivElement

      fireEvent.click(dropzone)
      expect(rootProps.onClick).toHaveBeenCalled()

      fireEvent.focus(dropzone)
      fireEvent.keyDown(dropzone)
      expect(rootProps.onFocus).toHaveBeenCalled()
      expect(rootProps.onKeydown).toHaveBeenCalled()

      fireEvent.blur(dropzone)
      expect(rootProps.onBlur).toHaveBeenCalled()

      fireEvent.dragEnter(dropzone, event)
      await flushPromises(rerender, TestCmp)
      expect(rootProps.onDragenter).toHaveBeenCalled()

      fireEvent.dragOver(dropzone, event)
      expect(rootProps.onDragover).toHaveBeenCalled()

      fireEvent.dragLeave(dropzone, event)
      expect(rootProps.onDragleave).toHaveBeenCalled()

      fireEvent.drop(dropzone, event)
      await flushPromises(rerender, TestCmp)
      expect(rootProps.onDrop).toHaveBeenCalled()
    })

    test('runs the custom callback handlers provided to the input props getter', async () => {
      const inputProps = {
        onClick: jest.fn(),
        onChange: jest.fn(),
      }
      const options = reactive({})
      const TestCmp = createTestComponent(options, {}, {}, inputProps)

      const { container, rerender } = render(TestCmp)

      const input = container.querySelector('input') as HTMLInputElement

      fireEvent.click(input)
      await flushPromises(rerender, TestCmp)
      expect(inputProps.onClick).toHaveBeenCalled()

      fireEvent.change(input)
      await flushPromises(rerender, TestCmp)
      expect(inputProps.onChange).toHaveBeenCalled()
    })

    test('runs no callback handlers if {disabled} is true', () => {
      const event = createDtWithFiles(files)

      const rootProps = {
        onClick: jest.fn(),
        onKeyDown: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onDragenter: jest.fn(),
        onDragover: jest.fn(),
        onDragleave: jest.fn(),
        onDrop: jest.fn(),
      }

      const inputProps = {
        onClick: jest.fn(),
        onChange: jest.fn(),
      }

      const options = reactive({
        disabled: true,
      })
      const TestCmp = createTestComponent(options, {}, {}, inputProps)

      const { container } = render(TestCmp)

      const dropzone = container.querySelector('div') as HTMLDivElement

      fireEvent.click(dropzone)
      expect(rootProps.onClick).not.toHaveBeenCalled()

      fireEvent.focus(dropzone)
      fireEvent.keyDown(dropzone)
      expect(rootProps.onFocus).not.toHaveBeenCalled()
      expect(rootProps.onKeyDown).not.toHaveBeenCalled()

      fireEvent.blur(dropzone)
      expect(rootProps.onBlur).not.toHaveBeenCalled()

      fireEvent.dragEnter(dropzone, event)
      expect(rootProps.onDragenter).not.toHaveBeenCalled()

      fireEvent.dragOver(dropzone, event)
      expect(rootProps.onDragover).not.toHaveBeenCalled()

      fireEvent.dragLeave(dropzone, event)
      expect(rootProps.onDragleave).not.toHaveBeenCalled()

      fireEvent.drop(dropzone, event)
      expect(rootProps.onDrop).not.toHaveBeenCalled()

      const input = container.querySelector('input') as HTMLInputElement

      fireEvent.click(input)
      expect(inputProps.onClick).not.toHaveBeenCalled()

      fireEvent.change(input)
      expect(inputProps.onChange).not.toHaveBeenCalled()
    })
  })
})
