<template>
    <ImageCompare class="shadow-lg rounded-2xl">
        <template #left>
            <img src="https://primefaces.org/cdn/primevue/images/compare/island1.jpg" />
        </template>
        <template #right>
            <img src="https://primefaces.org/cdn/primevue/images/compare/island2.jpg" />
        </template>
    </ImageCompare>
</template>
<script setup lang="ts">
defineOptions({
    name: 'HomeView',
    title: 'HomeView'
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
