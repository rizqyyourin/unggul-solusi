import { Barang } from './barang'
import { Pelanggan } from './pelanggan'

export type ItemPenjualan = {
  nota: string
  kode_barang: string
  qty: number
  barang?: Barang
}

export type Penjualan = {
  id_nota: string
  tgl: string
  kode_pelanggan: string
  subtotal: number
  pelanggan?: Pelanggan
  item_penjualan?: ItemPenjualan[]
}