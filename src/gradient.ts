interface Props {
    el: HTMLElement
}

type GradientDirection = "top" | "left" | "center" | "bottom" | "right"
type GradientType = "linear" | "radial"

export class GradientPicker {
    stops: string[] = []
    direction: GradientDirection = "right"
    el: HTMLElement
    type: GradientType = "linear"

    constructor({ el }: Props) {
        this.el = el
    }

    /**
     * Add color to the gradient
     * @param color The color string (HEX/RGB/any supported css color format)
     * @param position The position of the stop (0-100)
     */
    addColorStop(color: string, position: number) {
        this.stops.push(color)
    }

    changeGradientType(type: GradientType) {

    }
}