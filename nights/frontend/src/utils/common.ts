import { Topic } from "~core/interfaces/topic"
import { ImageQuality } from "~core/interfaces/title"

export const capitalizeFirst = (str: string) =>
  str?.charAt(0).toUpperCase() + str.slice(1)

export const joinTopics = (topics: Topic[], sep = " • ") =>
  topics?.map((g) => capitalizeFirst(g.name)).join(sep)

export const getImageUrl = (url: string, quality = ImageQuality.v250) =>
  url.replace("{q}v", quality).replace("{f}", "jpg")
