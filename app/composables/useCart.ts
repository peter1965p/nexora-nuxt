export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

const STORAGE_KEY = 'nexora-cart'

export const useCart = () => {
  const cart = useState<CartItem[]>('nx-cart', () => [])

  const persist = () => {
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.value))
  }

  const load = () => {
    if (!import.meta.client) return
    try { cart.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch {}
  }

  const add = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    const existing = cart.value.find(i => i.productId === item.productId)
    if (existing) existing.quantity += qty
    else cart.value.push({ ...item, quantity: qty })
    persist()
  }

  const updateQty = (productId: string, delta: number) => {
    const item = cart.value.find(i => i.productId === productId)
    if (!item) return
    item.quantity = Math.max(1, item.quantity + delta)
    persist()
  }

  const removeItem = (productId: string) => {
    cart.value = cart.value.filter(i => i.productId !== productId)
    persist()
  }

  const clear = () => {
    cart.value = []
    persist()
  }

  const count    = computed(() => cart.value.reduce((s, i) => s + i.quantity, 0))
  const subtotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.quantity, 0))

  return { cart, load, add, updateQty, removeItem, clear, count, subtotal }
}
