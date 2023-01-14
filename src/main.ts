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
