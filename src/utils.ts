
export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, attrs?: Record<string, string>, styles?: Record<string, string>): HTMLElementTagNameMap[K]  {
    const el = document.createElement(tagName)

    for(const attr in attrs) {
        el.setAttribute(attr, attrs[attr])
    }
    
    for(const style in styles) {
        el.style.setProperty(style, styles[style])
    }

    return el
}