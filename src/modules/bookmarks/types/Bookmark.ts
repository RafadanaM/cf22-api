import type { CircleId } from '@modules/circle/types/Circle';

export type Bookmark = {
  bookmarks: Record<CircleId, BookmarkDetail>;
  bookmarkedCircleIds: CircleId[];
};

export type UserBookmark = {
  bookmarkId: string;
} & Bookmark;

export type BookmarkDetail = {
  isComplete: boolean;
  id: CircleId;
  note: string;
};
