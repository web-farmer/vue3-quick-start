<template>
    <div class="home">
        <Tabs value="ImageCompare">
            <TabList>
                <Tab value="ImageCompare">图片对比</Tab>
                <Tab value="ImageCompressor">图片压缩</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="ImageCompare">
                    <ImageCompare />
                </TabPanel>
                <TabPanel value="ImageCompressor">
                    <ImageCompressor />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: 'HomeView',
    title: 'HomeView'
})

import ImageCompare from '../HomeView/ImageCompare.vue'
import ImageCompressor from '../HomeView/ImageCompressor.vue'
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
