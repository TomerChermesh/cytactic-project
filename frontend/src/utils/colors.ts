import { TagColor, TAG_COLORS } from '../constants/colors'

export const getTagColor = (colorId: TagColor): string => {
    return TAG_COLORS[colorId] || TAG_COLORS[TagColor.GRAY]
  }
  