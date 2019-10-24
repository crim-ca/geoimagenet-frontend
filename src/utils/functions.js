// @flow strict
import type { BoundingBox } from '../Types'

export function websocketify_uri(http_uri: string) {
  return http_uri.replace(/^https?:\/\//i, 'ws://')
}

export function get_center_of_bbox(bounding_box: BoundingBox) {
  const x = bounding_box[0] + (bounding_box[2] - bounding_box[0]) / 2
  const y = bounding_box[1] + (bounding_box[3] - bounding_box[1]) / 2
  return [x, y]
}
