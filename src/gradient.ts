import { createElement } from "./utils"

interface Props {
    el: HTMLElement
    previewEl: HTMLElement
}

type GradientDirection = "top" | "left" | "center" | "bottom" | "right"
type GradientType = "linear" | "radial"
type GradientStop = {
    color: string 
    position: number
}

export class GradientPicker {
    direction: GradientDirection = "right"
    el: HTMLElement
    previewEl: HTMLElement
    colorHandlersEl: HTMLElement
    type: GradientType = "linear"
    stops: GradientStop[] = []
    isDragging = false

    constructor({ el, previewEl }: Props) {
        this.el = el
        this.previewEl = previewEl
        this.colorHandlersEl = document.createElement('div')
        this.colorHandlersEl.classList.add('color__handlers')
        this.previewEl.append(this.colorHandlersEl)
        this.addColorStop("#3494E6", .5) 
        this.addColorStop("#EC6EAD", 99)

        this.listener()
    }

    /**
     * Add color to the gradient
     * @param color The color string (HEX/RGB/any supported css color format)
     * @param position The position of the stop (0-100)
     */
    addColorStop(color: string, position: number) {
        this.stops.push({ color, position })
        this.createStopHandler(this.stops.length-1)
        this.updateElementBackground()
    }

    changeGradientType(type: GradientType) {
        this.type = type 
        this.updateElementBackground()
    }

    getGradientString(type: GradientType = this.type, direction: GradientDirection = this.direction) {
        const round = (num: number) => Math.round(num * 100) / 100
        const colorConcat = [...this.stops]
                                .sort((a,b) => a.position - b.position)
                                .map(stop => ` ${stop.color} ${round(stop.position)}%`).join(',')

        if(type === 'radial') {
            const radialPositions: Record<GradientDirection, string> = {
                "bottom": "at center bottom",
                "center": "",
                "left": "at left center",
                "right": "at center right",
                "top": "at center top",
            }
            return `radial-gradient(circle ${radialPositions[direction]}, ${colorConcat})`
        } 
        
        return `linear-gradient(to ${direction},${colorConcat})`
    }

    private updateElementBackground() {
        const gradientString = this.getGradientString()
        this.el.style.backgroundImage = gradientString
        this.previewEl.style.backgroundImage = this.getGradientString('linear', 'right')
        let cssTextbox = document.getElementById('css')!
        cssTextbox.textContent = gradientString
    }

    private createStopHandler(stopIndex: number) {
        const colorStop = this.stops[stopIndex]

        // Handler bar
        const handler = createElement('div', { class: 'color__handler', 'data-index': stopIndex.toString() }, { '--handler-position': `${colorStop.position}%` })

        // Handler remover
        const handlerButtons = createElement('div', { class: 'color__handler-buttons', 'data-index': stopIndex.toString() }, { '--handler-position': `${colorStop.position}%` })
        const handlerRemover = createElement('div', { class: 'color__handler-remover' })

        // Color picker
        const inputColorWrapper = createElement('div', {
            type: 'color',
            class: 'color__input-wrapper',
        })
        const inputColor = createElement('input', {
            type: 'color',
            class: 'color__input',
            value: colorStop.color
        })
        inputColorWrapper.append(inputColor)
        
        inputColor.addEventListener('input', e => this.onColorChange(e as InputEvent, stopIndex))
        handler.addEventListener('mousedown', e => this.onHandlerMouseDown(e))
        handler.addEventListener('mouseup', e => this.onHandlerMouseUp(e))
        this.previewEl.addEventListener('mousemove', e => this.onHandlerMouseMove(e))
        handlerRemover.addEventListener('click', () => {
            this.stops.splice(stopIndex, 1)
            handler.remove()
            handlerButtons.remove()
            this.updateElementBackground()
        })

        handlerButtons.append(handlerRemover, inputColorWrapper)
        this.colorHandlersEl.append(handler)
        this.previewEl.append(handlerButtons)
    }

    onHandlerMouseDown(event: MouseEvent) {
        let handlerEl = event.target as HTMLElement
        handlerEl.classList.add('active')
        this.isDragging = true
    }

    onHandlerMouseMove(event: MouseEvent) {
        if(!this.isDragging) return

        let handlerEl = document.querySelector('.color__handler.active')
        if(!handlerEl?.classList.contains('active')) return 
        const stopIndex = ~~(handlerEl.getAttribute('data-index') || 0)

        const newStopPosition = this.getPercentage(event.clientX)

        if(newStopPosition < 0.5 || newStopPosition > 99.5) return

        this.changePosition(stopIndex, newStopPosition)
        this.updateElementBackground()
    }

    onHandlerMouseUp(event: MouseEvent) {
        let handlerEl = event.target as HTMLElement
        handlerEl.classList.remove('active')
        this.isDragging = false
    }

    changeColor(stopIndex: number, color: string) {
        this.stops[stopIndex].color = color
    }

    changePosition(stopIndex: number, position: number) {
        this.stops[stopIndex].position = position
        this.previewEl.querySelectorAll(`div[data-index='${stopIndex}']`).forEach((el) => (el as HTMLElement).style.setProperty('--handler-position', position+'%'))
    }

    onColorChange(event: InputEvent, index: number) {
        this.changeColor(index, (event.target as HTMLInputElement).value)
        this.updateElementBackground()
    }

    getPercentage(mouseX: number) {
        const rect = this.previewEl.getBoundingClientRect()
        const clickPosition = mouseX - rect.x
        const elementWidth = getComputedStyle(this.previewEl).width.slice(0, -2)
        const newStopPosition = clickPosition/~~elementWidth * 100

        return newStopPosition
    }

    listener() {
        this.previewEl.addEventListener('click', e => {
            if((e.target as HTMLElement).classList.contains('color__handler') || this.isDragging) return
            if(!this.colorHandlersEl.contains(e.target as HTMLElement)) return

            const newStopPosition = this.getPercentage(e.clientX)

            this.addColorStop("#333333", newStopPosition)
        })
        const directionInput = document.getElementById('direction') as HTMLInputElement
        const typeInput = document.getElementById('type') as HTMLInputElement

        directionInput?.addEventListener('input', () => {
            this.direction = directionInput.value as GradientDirection
            this.updateElementBackground()
        })
        typeInput?.addEventListener('input', () => {
            this.type = typeInput.value as GradientType
            
            this.updateElementBackground()
        })
    }
}