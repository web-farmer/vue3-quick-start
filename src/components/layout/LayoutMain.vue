<template>
    <router-view v-slot="{ Component, route }">
        <keep-alive>
            <component :is="Component" v-if="route.meta && route.meta.keepAlive" :key="route.fullPath" />
        </keep-alive>
        <component :is="Component" v-if="!(route.meta && route.meta.keepAlive)" :key="route.fullPath" />
    </router-view>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'LayoutMain'
})
</script>
