<template>
    <ImageCompareViewer
        :before="'https://primefaces.org/cdn/primevue/images/compare/island1.jpg'"
        :after="'https://primefaces.org/cdn/primevue/images/compare/island2.jpg'"
        style="width: 80vw; height: 80vh; margin: 0 auto; background: #000; border-radius: 16px"
    />
</template>
<script setup lang="ts">
import ImageCompareViewer from '@/components/ImageCompareViewer/index.vue'
defineOptions({
    name: 'ImageCompare',
    title: 'ImageCompare'
})
</script>
<style lang="scss" scoped></style>
