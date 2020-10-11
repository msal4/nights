import {PaginatedResults} from './paginated-results';

export interface Story {
  id: number;
  image: string;
}

export interface StoryDetail {
  id: number;
  name: string;
  body: string;
  image: string;
  likes: number;
  comments: PaginatedResults<Comment[]>;
}

export interface Comment {
  id: number;
  body: string;
  user: {id: number; username: string};
  topic: number;
  created_at: string;
}
