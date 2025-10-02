import { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import { api, ApiItemResponse, ApiListResponse } from './api'

export function useList<T>(url: string) {
  const { message } = App.useApp()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<ApiListResponse<T[]>>(url)
      setData(res.data.data)
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [url, message])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, refresh, setData }
}

export function useItem<T>(url: string) {
  const { message } = App.useApp()
  const [item, setItem] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<ApiItemResponse<T>>(url)
      setItem(res.data.data)
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [url, message])

  return { item, setItem, loading, fetch }
}
