import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock-upgrade'

interface LabelOptions {
    before: string
    after: string
    onHover: boolean
}

interface Settings {
    controlColor: string
    controlShadow: boolean
    addCircle: boolean
    addCircleBlur: boolean
    showLabels: boolean
    labelOptions: LabelOptions
    smoothing: boolean
    smoothingAmount: number
    hoverStart: boolean
    verticalMode: boolean
    startingPoint: number
    fluidMode: boolean
    lineWidth?: number
}

class ImageCompareViewer {
    private settings: Settings
    private el: HTMLElement
    private wrapper: HTMLElement | null = null
    private control: HTMLElement | null = null
    private arrowContainer: HTMLElement | null = null
    private arrowAnimator: HTMLElement[] = []
    private readonly safariAgent: boolean
    private slideWidth: number = 50
    private lineWidth: number
    private active: boolean = false
    private readonly arrowCoordinates = {
        circle: [5, 3] as const,
        standard: [8, 0] as const
    }

    constructor(el: HTMLElement, settings: Partial<Settings> = {}) {
        const defaults: Settings = {
            controlColor: '#FFFFFF',
            controlShadow: true,
            addCircle: false,
            addCircleBlur: true,
            showLabels: false,
            labelOptions: {
                before: 'Before',
                after: 'After',
                onHover: false
            },
            smoothing: true,
            smoothingAmount: 100,
            hoverStart: false,
            verticalMode: false,
            startingPoint: 50,
            fluidMode: false
        }

        this.settings = { ...defaults, ...settings }
        this.safariAgent = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')
        this.el = el
        this.lineWidth = settings.lineWidth || 2
    }

    public mount(): this {
        if (this.safariAgent) {
            this.settings.smoothing = false
        }

        this.shapeContainer()
        this.getImages()
        this.buildControl()
        this.setupEvents()
        return this
    }

    private setupEvents(): void {
        this.el.addEventListener('mousedown', (ev: MouseEvent) => {
            this.activate(true)
            document.body.classList.add('icv__body')
            disableBodyScroll(this.el, { reserveScrollBarGap: true })
            this.slideCompare(ev)
        })

        this.el.addEventListener('mousemove', (ev: MouseEvent) => {
            if (this.active) this.slideCompare(ev)
        })

        this.el.addEventListener('mouseup', () => this.activate(false))

        document.body.addEventListener('mouseup', () => {
            document.body.classList.remove('icv__body')
            enableBodyScroll(this.el)
            this.activate(false)
        })

        this.control?.addEventListener('touchstart', () => {
            this.activate(true)
            document.body.classList.add('icv__body')
            disableBodyScroll(this.el, { reserveScrollBarGap: true })
        })

        this.el.addEventListener('touchmove', (ev: TouchEvent) => {
            if (this.active) this.slideCompare(ev)
        })

        this.el.addEventListener('touchend', () => {
            this.activate(false)
            document.body.classList.remove('icv__body')
            enableBodyScroll(this.el)
        })

        this.el.addEventListener('mouseenter', () => {
            if (this.settings.hoverStart) this.activate(true)
            this.updateArrowPosition(true)
        })

        this.el.addEventListener('mouseleave', () => {
            this.updateArrowPosition(false)
        })

        if (!this.settings.fluidMode) {
            const imageA = this.el.querySelector('.icv__img-a') as HTMLElement
            const imageB = this.el.querySelector('.icv__img-b') as HTMLElement

            if (imageA) {
                window.addEventListener('resize', () => {
                    const elWidth = this.el.getBoundingClientRect().width
                    if (elWidth) {
                        imageB.style.width = `${elWidth.toFixed(2)}px`
                    }

                    ;[imageA, imageB].forEach(img => {
                        img.style.imageRendering = ''
                        img.style.transform = ''
                        img.style.transformOrigin = ''
                        img.style.maxWidth = ''
                    })
                })
            }
        }
    }

    private slideCompare(ev: MouseEvent | TouchEvent): void {
        if (!this.control || !this.wrapper) return

        const bounds = this.el.getBoundingClientRect()
        const clientX = 'touches' in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX
        const clientY = 'touches' in ev ? ev.touches[0].clientY : (ev as MouseEvent).clientY

        const x = clientX - bounds.left
        const y = clientY - bounds.top

        const position = this.settings.verticalMode ? (y / bounds.height) * 100 : (x / bounds.width) * 100

        if (position >= 0 && position <= 100) {
            const controlStyle = this.settings.verticalMode
                ? `calc(${position}% - ${this.slideWidth / 2}px)`
                : `calc(${position}% - ${this.slideWidth / 2}px)`

            if (this.settings.verticalMode) {
                this.control.style.top = controlStyle
            } else {
                this.control.style.left = controlStyle
            }

            if (this.settings.fluidMode) {
                this.wrapper.style.clipPath = this.settings.verticalMode
                    ? `inset(0 0 ${100 - position}% 0)`
                    : `inset(0 0 0 ${position}%)`
            } else {
                if (this.settings.verticalMode) {
                    this.wrapper.style.height = `calc(${position}%)`
                } else {
                    this.wrapper.style.width = `calc(${100 - position}%)`
                }
            }
        }
    }

    private activate(state: boolean): void {
        this.active = state
    }

    private shapeContainer(): void {
        const imposter = document.createElement('div')
        const labelL = document.createElement('span')
        const labelR = document.createElement('span')

        labelL.classList.add('icv__label', 'icv__label-before', 'keep')
        labelR.classList.add('icv__label', 'icv__label-after', 'keep')

        if (this.settings.labelOptions.onHover) {
            labelL.classList.add('on-hover')
            labelR.classList.add('on-hover')
        }

        if (this.settings.verticalMode) {
            labelL.classList.add('vertical')
            labelR.classList.add('vertical')
        }

        labelL.textContent = this.settings.labelOptions.before || 'Before'
        labelR.textContent = this.settings.labelOptions.after || 'After'

        if (this.settings.showLabels) {
            this.el.appendChild(labelL)
            this.el.appendChild(labelR)
        }

        this.el.classList.add(
            'icv',
            this.settings.verticalMode ? 'icv__icv--vertical' : 'icv__icv--horizontal',
            this.settings.fluidMode ? 'icv__is--fluid' : 'standard'
        )

        imposter.classList.add('icv__imposter')
        this.el.appendChild(imposter)
    }

    private buildControl(): void {
        const control = document.createElement('div')
        const uiLine = document.createElement('div')
        const arrows = document.createElement('div')
        const circle = document.createElement('div')

        arrows.classList.add('icv__theme-wrapper')

        for (let idx = 0; idx <= 1; idx++) {
            const animator = document.createElement('div')
            const rotation = this.getArrowRotation(idx)

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            svg.setAttribute('height', '15')
            svg.setAttribute('width', '15')
            svg.setAttribute('viewBox', '0 0 15 15')
            svg.setAttribute('data-name', 'Layer 1')

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.setAttribute('stroke', this.settings.controlColor)
            path.setAttribute('stroke-linecap', 'round')
            path.setAttribute('stroke-width', this.settings.addCircle ? '3' : '0')
            path.setAttribute('d', 'M4.5 1.9L10 7.65l-5.5 5.4')

            if (this.settings.addCircle) {
                path.setAttribute('fill', 'transparent')
            } else {
                path.setAttribute('fill', this.settings.controlColor)
            }

            svg.appendChild(path)
            animator.appendChild(svg)

            this.arrowAnimator.push(animator)
            arrows.appendChild(animator)
        }

        this.updateArrowPosition(false)

        control.classList.add('icv__control')
        control.style.cssText = `
      ${this.settings.verticalMode ? 'height' : 'width'}: ${this.slideWidth}px;
      ${this.settings.verticalMode ? 'top' : 'left'}: calc(${this.settings.startingPoint}% - ${this.slideWidth / 2}px);
      ${this.getTransitionStyle()}
    `

        uiLine.classList.add('icv__control-line')
        uiLine.style.cssText = `
      ${this.settings.verticalMode ? 'height' : 'width'}: ${this.lineWidth}px;
      background: ${this.settings.controlColor};
      ${this.settings.controlShadow ? 'box-shadow: 0px 0px 15px rgba(0,0,0,0.33);' : ''}
    `

        const uiLine2 = uiLine.cloneNode(true) as HTMLElement

        circle.classList.add('icv__circle')
        circle.style.cssText = `
      ${this.settings.addCircleBlur ? '-webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px);' : ''}
      border: ${this.lineWidth}px solid ${this.settings.controlColor};
      ${this.settings.controlShadow ? 'box-shadow: 0px 0px 15px rgba(0,0,0,0.33);' : ''}
    `

        control.appendChild(uiLine)
        if (this.settings.addCircle) control.appendChild(circle)
        control.appendChild(arrows)
        control.appendChild(uiLine2)

        this.arrowContainer = arrows
        this.control = control
        this.el.appendChild(control)
    }

    private getImages(): void {
        const children = this.el.querySelectorAll('img, video, .keep')
        this.el.innerHTML = ''
        children.forEach(img => this.el.appendChild(img))

        const childrenImages = Array.from(children).filter(element =>
            ['img', 'video'].includes(element.nodeName.toLowerCase())
        )

        if (this.settings.verticalMode) {
            childrenImages.reverse()
        }

        for (let idx = 0; idx <= 1; idx++) {
            const child = childrenImages[idx] as HTMLElement
            if (!child) continue

            child.classList.add('icv__img')
            child.classList.add(idx === 0 ? 'icv__img-a' : 'icv__img-b')

            if (idx === 1) {
                const imageWidth = this.el.querySelector('.icv__img-a')?.getBoundingClientRect().width
                const wrapper = document.createElement('div')
                const afterUrl = (childrenImages[1] as HTMLImageElement).src

                wrapper.classList.add('icv__wrapper')
                wrapper.style.cssText = `
          width: ${100 - this.settings.startingPoint}%;
          height: ${this.settings.startingPoint}%;
          ${this.getTransitionStyle()}
          ${this.getFluidModeStyle(afterUrl)}
        `

                if (!this.settings.fluidMode && imageWidth) {
                    child.style.width = `${imageWidth}px`
                }

                wrapper.appendChild(child)
                this.wrapper = wrapper
                this.el.appendChild(this.wrapper)
            }
        }

        if (this.settings.fluidMode) {
            const url = (childrenImages[0] as HTMLImageElement).src
            const fluidWrapper = document.createElement('div')
            fluidWrapper.classList.add('icv__fluidwrapper')
            fluidWrapper.style.cssText = `background-image: url(${url});`
            this.el.appendChild(fluidWrapper)
        }
    }

    private getArrowRotation(idx: number): string {
        if (idx === 0) {
            return this.settings.verticalMode ? '-90deg' : '180deg'
        }
        return this.settings.verticalMode ? '90deg' : '0deg'
    }

    private getTransitionStyle(): string {
        return 'ontouchstart' in document.documentElement || !this.settings.smoothing
            ? ''
            : `transition: ${this.settings.smoothingAmount}ms ease-out;`
    }

    private getFluidModeStyle(afterUrl: string): string {
        if (!this.settings.fluidMode) return ''
        return `
      background-image: url(${afterUrl});
      clip-path: inset(${
          this.settings.verticalMode
              ? `0 0 ${100 - this.settings.startingPoint}% 0`
              : `0 0 0 ${this.settings.startingPoint}%`
      })
    `
    }

    private updateArrowPosition(isHover: boolean): void {
        const coord = this.settings.addCircle ? this.arrowCoordinates.circle : this.arrowCoordinates.standard

        this.arrowAnimator.forEach((anim, i) => {
            const translateValue = isHover
                ? `${coord[1] * (i === 0 ? 1 : -1)}px`
                : `${i === 0 ? coord[0] : -coord[0]}px`

            anim.style.cssText = `
        ${
            this.settings.verticalMode
                ? `transform: translateY(${translateValue});`
                : `transform: translateX(${translateValue});`
        }
      `
        })
    }

    public reset(): void {
        // Reset implementation can be added here
    }
}

export default ImageCompareViewer
