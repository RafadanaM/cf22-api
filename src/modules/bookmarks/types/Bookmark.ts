import type { CircleId } from '@modules/circle/types/Circle';

export type UserBookmark = {
  bookmarkId: string;
  bookmarks: Record<CircleId, BookmarkDetail>;
  bookmarkedCircleIds: CircleId[];
};

export type BookmarkDetail = {
  isComplete: boolean;
  id: CircleId;
  note: string;
};
