// Small wrapper hooks to DRY fetch logic for lists and single items
import { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import { api, ApiItemResponse, ApiListResponse } from './api'

/**
 * useList: hook untuk mengambil list data dari endpoint API
 * - url: path relatif (contoh: '/barang')
 * - mengembalikan { data, loading, refresh, setData }
 */
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
      // Tampilkan notifikasi error lewat Antd message
      message.error(e?.response?.data?.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [url, message])

  // Fetch otomatis saat hook dipakai
  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, refresh, setData }
}

/**
 * useItem: hook untuk mengambil satu resource dari API
 * - url: path relatif (contoh: '/barang/BRG_1')
 * - mengembalikan { item, setItem, loading, fetch }
 */
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
