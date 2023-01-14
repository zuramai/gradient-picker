import { GradientPicker } from './gradient'
import './style.css'

const app = document.getElementById('app')!
const preview = document.getElementById('preview')!
new GradientPicker({
  el: app,
  previewEl: preview
})