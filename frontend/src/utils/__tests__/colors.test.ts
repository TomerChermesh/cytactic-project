import { describe, it, expect } from 'vitest'
import { getTagColor } from '../colors'
import { TagColor } from '../../constants/colors'


describe('getTagColor', () => {
  it.each<[TagColor, string]>([
    [TagColor.GRAY, '#9E9E9E'],
    [TagColor.BLUE, '#2196F3'],
    [TagColor.GREEN, '#4CAF50'],
    [TagColor.ORANGE, '#FF9800'],
    [TagColor.PURPLE, '#9C27B0'],
    [TagColor.CYAN, '#00BCD4'],
    [TagColor.RED, '#F44336']
  ])('should convert %d to %s', (value: TagColor, expected: string) => {
    const result: string = getTagColor(value)
    expect(result).toBe(expected)
  })
})
