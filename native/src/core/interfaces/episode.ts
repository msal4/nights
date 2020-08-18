import { Video, Subtitle, Image } from "./topic";
import { ViewHit } from "./view-hit";

export interface Episode {
  id: number;
  name: string;
  plot: string;
  runtime: number;
  image?: string;
  images: Image[];
  videos: Video[];
  subtitles: Subtitle[];
  hits: ViewHit[];
  index: number;
  views: number;
}
