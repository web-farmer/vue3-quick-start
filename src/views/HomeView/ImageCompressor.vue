<template>
    <FileUpload
        @select="handleFileUpload"
        customUpload
        auto
        severity="secondary"
        class="p-button-outlined"
        accepts="image/*"
    />
    <ImageCompare class="shadow-lg rounded-2xl" v-if="compressTarget && compressRes">
        <template #left>
            <img :src="compressTarget" />
        </template>
        <template #right>
            <img :src="compressRes" />
        </template>
    </ImageCompare>
</template>
<script setup lang="ts">
defineOptions({
    name: 'ImageCompressor',
    title: 'ImageCompressor'
})

import Compressor from 'compressorjs'

const compressTarget = ref<any>(null)
const compressRes = ref<any>(null)

const handleFileUpload = (event: any) => {
    compressTarget.value = null
    compressRes.value = null
    const file = event.files[0]

    const reader = new FileReader()
    reader.onload = async (e: any) => {
        compressTarget.value = e.target.result?.replace(/^data:application\/(json|octet-stream);/, 'data:image/png;')
    }
    reader.readAsDataURL(file)
    console.log('before compress', file)
    new Compressor(file, {
        // maxWidth,
        // maxHeight,
        // convertSize: convertSize * FILE_SIZE_UNIT,
        quality: 0.1,
        // The compression process is asynchronous,
        // which means you have to access the `result` in the `success` hook function.
        success(result: any) {
            console.log('after compress', result)
            const reader = new FileReader()
            reader.onload = async (e: any) => {
                compressRes.value = e.target.result?.replace(
                    /^data:application\/(json|octet-stream);/,
                    'data:image/png;'
                )
            }
            reader.readAsDataURL(result)
        },
        error(err: any) {
            console.error(err)
        }
    })
}
</script>
