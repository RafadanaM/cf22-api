import type { initDB } from '@db/db';
import { RepositoryError } from '@core/errors/errors';

import type { UserBookmark } from '../types/Bookmark';

export interface BookmarkRepository {
  getBookmarkById: (id: string) => UserBookmark | null;
  upsertBookmarkById: (id: string, bookmarkData: UserBookmark) => UserBookmark;
}

function createBookmarkRepository(db: ReturnType<typeof initDB>): BookmarkRepository {
  const upsertStmt = db.query<null, { id: string; data: string }>(`
  INSERT INTO bookmarks (id, data)
  VALUES ($id, $data)
  ON CONFLICT(id) DO UPDATE SET data = EXCLUDED.data
`);
  const getBookmarkStmt = db.query<{ data: string }, { id: string }>(
    'SELECT data FROM bookmarks WHERE id = $id'
  );

  const getBookmarkById = (id: string): UserBookmark | null => {
    const result = getBookmarkStmt.get({ id });
    if (!result) return null;

    try {
      return JSON.parse(result.data) as UserBookmark;
    } catch (err) {
      throw new RepositoryError('PARSE_BOOKMARK_ERROR', { cause: err });
    }
  };

  return {
    getBookmarkById,
    upsertBookmarkById: (id: string, bookmarkData: UserBookmark): UserBookmark => {
      try {
        upsertStmt.run({
          id,
          data: JSON.stringify(bookmarkData)
        });
        return bookmarkData;
      } catch (err) {
        throw new RepositoryError('UPSERT_BOOKMARK_ERROR', {
          cause: err
        });
      }
    }
  };
}

export default createBookmarkRepository;
