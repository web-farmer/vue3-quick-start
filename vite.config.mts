import { fileURLToPath, URL } from 'node:url'
import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import dayjs from 'dayjs'
// 引入插件
import VitePluginMetaEnv from 'vite-plugin-meta-env'
// gzip压缩
// import { visualizer } from 'rollup-plugin-visualizer'
// import viteCompression from 'vite-plugin-compression'
// import viteImagemin from 'vite-plugin-imagemin'
// @ts-ignore
import pkg from './package.json'
const { name: title, version: APP_VERSION } = pkg

// https://vitejs.dev/config/
export default () => {
    // 增加环境变量
    const metaEnv = {
        APP_VERSION,
        APP_NAME: title,
        APP_BUILD_TIME: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    return defineConfig({
        // 设置打包路径
        base: process.env.NODE_ENV === 'development' ? '/' : `/${title}/`,
        // 插件
        plugins: [
            vue({
                script: {
                    defineModel: true
                },
                template: {
                    compilerOptions: {
                        // iconpark- 视为自定义元素
                        isCustomElement: tag => tag.includes('iconpark-')
                    }
                }
            }),
            vueJsx(),
            // 按需导入
            AutoImport({
                // targets to transform
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/ // .md
                ],
                // global imports to register
                imports: ['vue', 'vue-router', 'pinia'],

                // Filepath to generate corresponding .d.ts file.
                // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
                // Set `false` to disable.
                dts: './auto-imports.d.ts',

                // Inject the imports at the end of other imports
                injectAtEnd: true,

                // Generate corresponding .eslintrc-auto-import.json file.
                // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
                eslintrc: {
                    enabled: true, // Default `false`
                    filepath: './.eslintrc-auto-import.json' // Default `./.eslintrc-auto-import.json`
                }
            }),
            Components({
                resolvers: [PrimeVueResolver()]
            }),
            // 环境变量
            VitePluginMetaEnv(metaEnv, 'import.meta.env'),
            VitePluginMetaEnv(metaEnv, 'process.env')
        ],
        // 别名
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        // 打包配置
        build: {
            sourcemap: false,
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
                    entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
                    assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
                    // entryFileNames: 'main-app.js',
                    manualChunks(id, { getModuleInfo }) {
                        // 打包依赖
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                        const reg = /(.*)\/src\/components\/(.*)/
                        if (reg.test(id)) {
                            // @ts-ignore
                            const importersLen = getModuleInfo(id).importers.length
                            // 被多处引用
                            if (importersLen > 1) {
                                return 'common'
                            }
                        }
                    }
                },
                plugins: [
                    // build.rollupOptions.plugins[]
                    // viteCompression({
                    //     verbose: true, // 是否在控制台中输出压缩结果
                    //     disable: false,
                    //     threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
                    //     algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
                    //     ext: '.gz',
                    //     deleteOriginFile: true // 源文件压缩后是否删除(我为了看压缩后的效果，先选择了true)
                    // })
                    // 参数及配置：https://github.com/vbenjs/vite-plugin-imagemin/blob/main/README.zh_CN.md
                    // viteImagemin({
                    //     gifsicle: {
                    //         optimizationLevel: 7,
                    //         interlaced: false
                    //     },
                    //     optipng: {
                    //         optimizationLevel: 7
                    //     },
                    //     mozjpeg: {
                    //         quality: 20
                    //     },
                    //     pngquant: {
                    //         quality: [0.8, 0.9],
                    //         speed: 4
                    //     },
                    //     svgo: {
                    //         plugins: [
                    //             {
                    //                 name: 'removeViewBox'
                    //             },
                    //             {
                    //                 name: 'removeEmptyAttrs',
                    //                 active: false
                    //             }
                    //         ]
                    //     }
                    // })
                ]
            }
        },
        // 本地服务配置
        server: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            cors: true,
            open: false,
            port: 5000,
            host: true,
            proxy: {
                '/apis': {
                    target: 'https://cloud-app.com.cn/api/',
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/apis/, '')
                },
                '/amap': {
                    target: 'https://restapi.amap.com/',
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/amap/, '')
                }
            }
        }
    })
}
