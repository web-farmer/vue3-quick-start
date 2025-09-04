<template>
    <div id="image-compare">
        <img src="https://primefaces.org/cdn/primevue/images/compare/island1.jpg" alt="" />
        <img src="https://primefaces.org/cdn/primevue/images/compare/island2.jpg" alt="" />
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: 'ImageCompare',
    title: 'ImageCompare'
})

import ImageCompareViewer from '@/components/ImageCompareViewer'
import '@/components/ImageCompareViewer/index.scss'

let scaleFactor = 1 // 缩放比例因子
let mouseX = 0 // 鼠标相对于元素的X坐标
let mouseY = 0 // 鼠标相对于元素的Y坐标
let lastMouseX = 0 // 上一次鼠标的X坐标
let lastMouseY = 0 // 上一次鼠标的Y坐标

const handleComparePosition = (event: MouseEvent) => {
    const container = document.getElementById('image-compare')
    if (!container) return
    mouseX = event.pageX - container.offsetLeft
    mouseY = event.pageY - container.offsetTop
}
const handleCompareScale = (event: WheelEvent) => {
    const container: any = document.getElementById('image-compare')
    if (!container) return

    // const imageElements = container.querySelectorAll('.icv__img')
    const imageElements = container.querySelectorAll('.icv__wrapper,.icv__fluidwrapper')
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
    scaleFactor = Math.min(Math.max(1, scaleFactor), 10)

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

onMounted(() => {
    nextTick(() => {
        const element = document.getElementById('image-compare')
        if (!element) return
        const options = {
            // UI Theme Defaults

            controlColor: '#FFFFFF',
            controlShadow: true,
            addCircle: false,
            addCircleBlur: true,

            // Label Defaults

            showLabels: true,
            labelOptions: {
                before: 'Before',
                after: 'After',
                onHover: false
            },

            // Smoothing

            smoothing: true,
            smoothingAmount: 100,

            // Other options

            hoverStart: false,
            verticalMode: false,
            startingPoint: 50,
            fluidMode: true
        }
        const viewer = new ImageCompareViewer(element, options).mount()
    })
})

onUnmounted(() => {
    document.getElementById('image-compare')?.removeEventListener('wheel', handleCompareScale)
    document.getElementById('image-compare')?.removeEventListener('mousemove', handleComparePosition)
})
</script>
<style lang="scss" scoped>
#image-compare {
    width: 80vw;
    height: 80vh;
    margin: 0 auto;
    overflow: hidden;
}
</style>
