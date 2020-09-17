import {Title} from './title';
import {Episode} from './episode';

export interface ViewHit {
  id: number;
  user: number;
  topic: Title;
  season: number | null;
  episode: Episode | null;
  playback_position: number;
  runtime: number;
  hit_date: string;
}
