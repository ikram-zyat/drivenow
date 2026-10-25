import { useState, useEffect } from 'react'
import { CARS } from './data.js'

const KEY = 'dn_cars'

export function getCars() {
  try {
    const s = localStorage.getItem(KEY)
    return s ? JSON.parse(s) : CARS
  } catch {
    return CARS
  }
}

export function setCars(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    alert('Stockage plein : réduis le nombre de photos ou supprime des voitures.')
    return false
  }
  window.dispatchEvent(new Event('dn'))
  return true
}

export function resetCars() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event('dn'))
}

export function useCars() {
  const [cars, set] = useState(getCars)
  useEffect(() => {
    const f = () => set(getCars())
    window.addEventListener('dn', f)
    window.addEventListener('storage', f)
    return () => {
      window.removeEventListener('dn', f)
      window.removeEventListener('storage', f)
    }
  }, [])
  return cars
}
