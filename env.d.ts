/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly BASE_URL: string
    readonly MODE: string
    readonly APP_VERSION: string
    readonly APP_NAME: string
    readonly APP_BUILD_TIME: string
    readonly VITE_BASE_URL: string
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
    readonly glob: (path: string, config: object) => Record<string, () => Promise<{ default: any }>>
}

declare module 'image-compare-viewer' {
    interface ImageCompareOptions {}

    export default class ImageCompare {
        constructor(element: HTMLElement | null, options?: any)
        mount(): this // 如果 `mount` 方法返回实例本身
        // 如果返回值不同，可以替换 `this` 为实际的返回类型。
    }
}
