/**
 * @Author: forguo
 * @Date: 2022/5/16 21:29
 * @Description: request.ts.js
 */

import axios from 'axios'
import type { AxiosResponse, AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'
import { useUserStore } from '@/stores'

/**
 * @Description: 请求响应接口
 */
export interface ApiResponse<D = any> {
    code?: number
    message?: string
    time?: string | number
    data?: D
}

/**
 * 接口返回 Promise 类型
 */
export type ApiPromise<T = any> = Promise<ApiResponse<T>>

class Request {
    // axios实例
    instance: AxiosInstance
    // 用于存储控制器对象
    abortControllerMap: Map<string, AbortController>
    // 构造函数
    constructor(config?: CreateAxiosDefaults) {
        // 创建axios实例
        this.instance = axios.create(config)
        // 用于存储控制器对象
        this.abortControllerMap = new Map()
        // 设置拦截器
        this.setInterceptors(this.instance)
    }
    // 请求
    request(config: AxiosRequestConfig): ApiPromise {
        return this.instance(config)
    }

    /**
     * 处理响应
     * @param res
     */
    handleResponse(res: AxiosResponse & any) {
        const { userLogout } = useUserStore()
        const url = res.config.url || ''
        // 请求完成后，将控制器实例从Map中移除
        this.abortControllerMap.delete(url)
        if (axios.isCancel(res)) {
            console.log('Request canceled', res)
            return Promise.reject(res)
        }
        if (res.status === 200) {
            const { showError = true } = res.config
            const { code } = res.data
            if (code === 200) {
                return Promise.resolve(res.data)
            } else if (code === 401) {
                userLogout()
                // Modal.confirm({
                //     title: '确认',
                //     content: '登录已过期，请重新登录~',
                //     onOk() {
                //         userLogout()
                //         return Promise.reject(res.data)
                //     }
                // })
            } else {
                if (showError) {
                    alert(res.data.message || '服务繁忙，请重试~')
                }
                return Promise.reject(res.data)
            }
        } else {
            const { showError = true } = res.config
            if (showError) {
                alert(res.message || res.data.message || res.response.statusText || '服务繁忙，请重试~')
            }
        }
        return Promise.reject(res)
    }
    // 拦截器
    setInterceptors(request: AxiosInstance) {
        // 请求拦截器
        request.interceptors.request.use(config => {
            const { token } = useUserStore()
            // toDo 也可以在这里做一个重复请求的拦截
            // https://github.com/axios/axios/tree/main#abortcontroller
            // 请求url为key
            const url = config.url || ''
            // 实例化控制器
            const controller = new AbortController()
            // 将控制器实例与请求绑定
            config.signal = controller.signal
            // 将控制器实例存储到Map中
            this.abortControllerMap.set(url, controller)
            // 设置请求头
            if (config && config.headers && token) {
                config.headers.set('Authorization', `Bearer ${token}`)
            }
            return config
        })
        // 响应拦截器
        request.interceptors.response.use(
            res => {
                return this.handleResponse(res)
            },
            res => {
                return this.handleResponse(res)
            }
        )
    }
    /**
     * 取消全部请求
     */
    cancelAllRequest() {
        for (const [, controller] of this.abortControllerMap) {
            // 取消请求
            controller.abort()
        }
        this.abortControllerMap.clear()
    }
    /**
     * 取消指定的请求
     * @param url 待取消的请求URL
     */
    cancelRequest(url: string | string[]) {
        const urlList = Array.isArray(url) ? url : [url]
        for (const _url of urlList) {
            // 取消请求
            this.abortControllerMap.get(_url)?.abort()
            this.abortControllerMap.delete(_url)
        }
    }
}

const instance = new Request({
    baseURL: `${import.meta.env.VITE_API_URL}`
} as CreateAxiosDefaults)

// 请求
export const request = (config: AxiosRequestConfig & any): ApiPromise => {
    return instance.request(config)
}

// 取消请求
export const cancelRequest = (url: string) => {
    instance.cancelRequest(url)
}

export default Request
