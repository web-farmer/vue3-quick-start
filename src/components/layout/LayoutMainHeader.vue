<script setup lang="ts">
defineOptions({
    name: 'LayoutMainHeader'
})

const emits = defineEmits(['back'])
</script>

<template>
    <header class="layout-header"></header>
</template>

<style scoped lang="scss">
.layout-header {
    width: 100%;
    display: flex;
    align-items: center;
    height: 64px;
    box-sizing: border-box;
    position: relative;
    background: none;
    color: inherit;
    border-bottom: 1px solid #e5e6eb;
}
</style>
