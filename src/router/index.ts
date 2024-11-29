import LayoutMain from '@/components/layout/LayoutMain.vue'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { type RouterOptions } from 'vue-router'

// 路由集合
const routes: (RouteRecordRaw | any)[] = [
    {
        path: '/',
        redirect: { path: '/HomeView' },
        component: LayoutMain,
        children: [
            {
                path: '/:pathMatch(.*)*',
                component: () => import('@/views/ErrorView/NotFound.vue')
            }
        ]
    }
]

// 匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 chunk。如果你倾向于直接引入所有的模块（例如依赖于这些模块中的副作用首先被应用），你可以传入 { eager: true } 作为第二个参数：
const views: any = import.meta.glob(`@/views/*/index.vue`, { eager: true })

// 动态加载路由
for (const componentPath in views) {
    // 找到example的组件，并加载
    const $component = views[componentPath].default
    // 默认首页必须得
    if ($component && !$component.hidden) {
        const { name, title } = $component
        routes[0].children.push({
            path: name === 'HomeView' ? '/' : `/${name}`,
            name: name,
            title,
            component: $component,
            meta: {
                name,
                title
            }
        })
    }
}

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [...routes]
} as RouterOptions)
console.log(routes)
export default router
