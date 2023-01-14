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

    constructor({ el, previewEl }: Props) {
        this.el = el
        this.previewEl = previewEl
        this.colorHandlersEl = document.createElement('div')
        this.colorHandlersEl.classList.add('color__handlers')
        this.previewEl.append(this.colorHandlersEl)
        this.addColorStop("#3494E6", .5) 
        this.addColorStop("#EC6EAD", 99)
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

    getGradientString(type: GradientType = this.type) {
        const colorConcat = this.stops.map(stop => `${stop.color} ${stop.position}%`).join(',')

        if(type === 'radial') {
            const radialPositions: Record<GradientDirection, string> = {
                "bottom": "at center bottom",
                "center": "circle",
                "left": "at left center",
                "right": "at center right",
                "top": "at center top",
            }
            return `radial-gradient(${radialPositions[this.direction]}, ${colorConcat})`
        } 
        
        return `linear-gradient(to ${this.direction}, ${colorConcat})`
    }

    private updateElementBackground() {
        this.el.style.backgroundImage = this.getGradientString()
        this.previewEl.style.backgroundImage = this.getGradientString('linear')
    }

    private createStopHandler(stopIndex: number) {
        const colorStop = this.stops[stopIndex]

        // Handler bar
        const handler = document.createElement('div')
        handler.classList.add('color__handler')
        handler.style.setProperty('--handler-position', `${colorStop.position}%`)

        // Handler remover
        const handlerRemover = document.createElement('div')
        handlerRemover.classList.add('color__handler-remover')
        handlerRemover.style.setProperty('--handler-position', `${colorStop.position}%`)

        handlerRemover.addEventListener('click', e => {
            this.stops.splice(stopIndex, 1)
            handler.remove()
            handlerRemover.remove()
        })

        this.colorHandlersEl.append(handler)
        this.previewEl.append(handlerRemover)
    }
}