import { type ClassValue as ClsxClassValue, clsx } from 'clsx'
import { cubicOut } from 'svelte/easing'
import { twMerge } from 'tailwind-merge'

import type { TransitionConfig } from 'svelte/transition'

export type ClassValue = string | null | undefined

export const cn = (...inputs: ClsxClassValue[]): string => {
  return twMerge(clsx(inputs))
}

interface FlyAndScaleParams {
  y?: number
  x?: number
  start?: number
  duration?: number
}

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
  const computedStyle = getComputedStyle(node)
  const transform = computedStyle.transform === 'none' ? '' : computedStyle.transform

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number],
  ): number => {
    const [minA, maxA] = scaleA
    const [minB, maxB] = scaleB

    const percentage = (valueA - minA) / (maxA - minA)
    return percentage * (maxB - minB) + minB
  }

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str
      return str + `${key}:${style[key]};`
    }, '')
  }

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0])
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0])
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1])

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      })
    },
    easing: cubicOut,
  }
}
