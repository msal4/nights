import { Topic } from "~core/interfaces/topic"

export const capitalizeFirst = (str: string): string =>
  str?.charAt(0).toUpperCase() + str.slice(1)

export const joinTopics = (topics: Topic[], sep: string = " • "): string =>
  topics?.map((g) => capitalizeFirst(g.name)).join(sep)
