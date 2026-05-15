import { NotFoundError } from '@core/errors/errors';
import type { BookmarkRepository } from '../repositories/BookmarkRepository';
import type { UserBookmark } from '../types/Bookmark';

export interface BookmarkService {
  getBookmark: (id: string) => UserBookmark | null;
  upsertBookmark: (id: string, bookmarkData: UserBookmark) => UserBookmark;
}

function createBookmarkService(bookmarkRepository: BookmarkRepository): BookmarkService {
  return {
    getBookmark: (id: string) => {
      const bookmark = bookmarkRepository.getBookmarkById(id);
      if (!bookmark) {
        throw new NotFoundError('Bookmark data does not exists');
      }

      return bookmark;
    },
    upsertBookmark: (id: string, bookmarkData: UserBookmark) => {
      const bookmark = bookmarkRepository.upsertBookmarkById(id, bookmarkData);

      return bookmark;
    }
  };
}

export default createBookmarkService;
