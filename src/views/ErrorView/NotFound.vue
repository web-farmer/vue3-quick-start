<template>
    <div class="error-page">
        <Card>
            <template #title>404</template>
            <template #subtitle>对不起，您访问的页面不存在</template>
            <template #footer>
                <Button type="primary" @click="$router.replace({ path: '/' })">回到首页</Button>
            </template>
        </Card>
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'NotFound'
})
</script>

<style scoped>
.error-page {
    width: 100%;
    height: 100%;
    background: #fff;
}
</style>
