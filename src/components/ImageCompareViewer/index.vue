<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ImageCompareViewer from './ImageCompareViewer'

interface LabelOptions {
    before?: string
    after?: string
    onHover?: boolean
}

interface CompareProps {
    controlColor?: string
    controlShadow?: boolean
    addCircle?: boolean
    addCircleBlur?: boolean
    showLabels?: boolean
    labelOptions?: LabelOptions
    smoothing?: boolean
    smoothingAmount?: number
    hoverStart?: boolean
    verticalMode?: boolean
    startingPoint?: number
    fluidMode?: boolean
}

const props = withDefaults(defineProps<CompareProps>(), {
    controlColor: '#fff',
    controlShadow: true,
    addCircle: false,
    addCircleBlur: true,
    showLabels: false,
    labelOptions: () => ({ before: 'Before', after: 'After', onHover: false }),
    smoothing: true,
    smoothingAmount: 100,
    hoverStart: false,
    verticalMode: false,
    startingPoint: 50,
    fluidMode: false
})

const containerRef = ref<HTMLDivElement | null>(null)
let viewer: ImageCompareViewer | null = null

onMounted(() => {
    if (containerRef.value) {
        viewer = new ImageCompareViewer(containerRef.value, props)
        viewer.mount()
    }
})

onUnmounted(() => {
    viewer = null
})
</script>

<template>
    <div ref="containerRef" class="image-comparison">
        <!-- Before -->
        <img :src="$slots.before?.()[0].props.src" class="before" />
        <!-- After -->
        <img :src="$slots.after?.()[0].props.src" class="after" />
    </div>
</template>

<style lang="scss">
@import './styles/index.scss';
</style>
