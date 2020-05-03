export interface Topic {
  id: number
  name: string
}
export interface Subtitle {
  url: string
  language: string
  formats: string
}

export interface Trailer {
  url: string
  formats: string
}

export interface Video {
  url: string
  formats: string
  qualities: string
}

export interface Image {
  url: string
}

export interface ViewHitData {
  playback_position: number
  runtime: number
  season?: number
  episode?: number
}
