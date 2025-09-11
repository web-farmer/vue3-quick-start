<template>
    <div id="ImageCompareViewer" ref="ImageCompareViewerRef" class="image-compare-viewer">
        <img :src="props.before" alt="before" class="before-image comp-image" />
        <img :src="props.after" alt="after" class="after-image comp-image" />
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: 'ImageCompareViewer'
})

interface IProps {
    // 对比前
    before: any
    // 对比后
    after: any
    // 最大
    maxScale?: number
}

const props = withDefaults(defineProps<IProps>(), {
    maxScale: 3
})

import ImageCompareViewer from './index'

import '../ImageCompareViewer/index.scss'

let scaleFactor = 1 // 缩放比例因子
let mouseX = 0 // 鼠标相对于元素的X坐标
let mouseY = 0 // 鼠标相对于元素的Y坐标
let lastMouseX = 0 // 上一次鼠标的X坐标
let lastMouseY = 0 // 上一次鼠标的Y坐标

let viewer: any

const handleComparePosition = (event: MouseEvent) => {
    const container = document.getElementById('ImageCompareViewer')
    if (!container) return
    // 鼠标在容器内的相对位置
    const rect = container.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
}

const handleCompareScale = (event: WheelEvent) => {
    const container: any = document.getElementById('ImageCompareViewer')
    if (!container) return

    const imageElements = container.querySelectorAll('.icv__img')
    if (!imageElements || !imageElements.length) return

    // 假设事件处理程序用于鼠标滚轮事件
    event.preventDefault()

    // 如果当前宽高有缩放值，使用它们，否则用默认值
    const scaleWidth = lastMouseX > 0 ? lastMouseX : mouseX
    const scaleHeight = lastMouseY > 0 ? lastMouseY : mouseY

    // 计算缩放的参考点
    const scaleX = (1 / container.clientWidth) * scaleWidth
    const scaleY = (1 / container.clientHeight) * scaleHeight

    // 保存当前宽高
    lastMouseX = mouseX
    lastMouseY = mouseY

    // 根据鼠标滚轮调整缩放级别
    scaleFactor += event.deltaY * -0.005
    // 限制缩放级别在 1 到 10 之间
    scaleFactor = Math.min(Math.max(1, scaleFactor), props.maxScale)

    // 遍历图像元素集合，应用缩放和样式调整
    for (let i = 0; i < imageElements.length; i++) {
        const img = imageElements[i]

        if (scaleFactor > 1) {
            // 高于 1 时，启用像素化模式，设置缩放和中心点
            img.style.imageRendering = 'pixelated'
            img.style.transform = `scale(${scaleFactor})`
            img.style.transformOrigin = `${scaleX * 100}% ${scaleY * 100}%`
            img.style.maxWidth = 'unset' // 取消宽度限制
        } else {
            // 恢复原始样式
            img.style.imageRendering = null
            img.style.transform = null
            img.style.transformOrigin = null
            img.style.maxWidth = null
        }
    }
}

const resetCompareScale = () => {
    console.log('resetCompareScale')
    // viewer?.reset()

    scaleFactor = 1
    mouseX = 0
    mouseY = 0
    lastMouseX = 0
    lastMouseY = 0

    const container: any = document.getElementById('ImageCompareViewer')
    if (!container) return

    const imageElements = container.querySelectorAll('.icv__img')
    if (!imageElements || !imageElements.length) return

    // 遍历图像元素集合，应用缩放和样式调整
    for (let i = 0; i < imageElements.length; i++) {
        const img = imageElements[i]

        // 恢复原始样式
        img.style.imageRendering = null
        img.style.transform = null
        img.style.transformOrigin = null
        img.style.maxWidth = null
    }
}

onMounted(() => {
    const container = document.getElementById('ImageCompareViewer')
    if (!container) return
    const options = {
        // UI Theme Defaults

        controlColor: '#FFFFFF',
        controlShadow: true,
        addCircle: true,
        addCircleBlur: true,
        lineWidth: 1,

        // Label Defaults

        showLabels: false,
        labelOptions: {
            before: 'Before',
            after: 'After',
            onHover: false
        },

        // Smoothing

        smoothing: false, // 开启可能导致卡顿
        smoothingAmount: 100,

        // Other options

        hoverStart: false,
        verticalMode: false,
        startingPoint: 50,
        fluidMode: false
    }
    viewer = new ImageCompareViewer(container, options).mount()

    container.addEventListener('wheel', handleCompareScale)
    container.addEventListener('mousemove', handleComparePosition)
})

onUnmounted(() => {
    const container = document.getElementById('ImageCompareViewer')
    if (container) {
        container?.removeEventListener('wheel', handleCompareScale)
        container?.removeEventListener('mousemove', handleComparePosition)
    }
})
</script>
<style lang="scss" scoped>
.image-compare-viewer {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    .comp-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    :deep(.icv__img-a) {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    :deep(.icv__img-b) {
        height: 100%;
        object-fit: contain;
    }
}
</style>
