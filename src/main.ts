import { GradientPicker } from './gradient'
import './style.css'

const app = document.getElementById('app')!
const preview = document.getElementById('preview')!
const colorHandlers = document.createElement('div')
colorHandlers.classList.add('color__handlers')

// TODO: publish UI library
new GradientPicker({
  el: app,
  previewEl: preview,
  colorHandlersEl: colorHandlers,
})

const copyCssButton = document.getElementById('copy-css')
copyCssButton?.addEventListener('click', () => {
  let textarea = document.querySelector("#css") as HTMLTextAreaElement;
  navigator.clipboard.writeText(textarea.value);
  
  // Show "Copied!" text
  const copiedEl = document.getElementById('copied')
  copiedEl?.classList.add('show')
  setTimeout(() => copiedEl?.classList.remove('show'), 500);
})