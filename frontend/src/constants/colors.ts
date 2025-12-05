export const TagColor = {
  GRAY: 0,
  BLUE: 1,
  GREEN: 2,
  ORANGE: 3,
  PURPLE: 4,
  CYAN: 5,
  RED: 6,
} as const

export type TagColor = typeof TagColor[keyof typeof TagColor]

export const TAG_COLORS: Record<TagColor, string> = {
  [TagColor.GRAY]: '#9E9E9E',
  [TagColor.BLUE]: '#2196F3',
  [TagColor.GREEN]: '#4CAF50',
  [TagColor.ORANGE]: '#FF9800', 
  [TagColor.PURPLE]: '#9C27B0',
  [TagColor.CYAN]: '#00BCD4',
  [TagColor.RED]: '#F44336'
}
