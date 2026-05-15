import { Elysia } from 'elysia';

import type createAppPlugin from '@plugins/appPlugin';

import type createBookmarkPlugin from '../plugins/BookmarkPlugin';
import UpsertBookmarkSchema from '../dtos/UpsertBookmarkDTO';

function createBookmarkController(
  appPlugin: ReturnType<typeof createAppPlugin>,
  bookmarkPlugin: ReturnType<typeof createBookmarkPlugin>
) {
  const billController = new Elysia({ prefix: '/bookmarks' })
    .use(appPlugin)
    .use(bookmarkPlugin)
    .get('/:id', ({ bookmarkService, params: { id } }) => {
      return bookmarkService.getBookmark(id);
    })
    .put(
      '/:id',
      ({ bookmarkService, params: { id }, body }) => {
        return bookmarkService.upsertBookmark(id, body.bookmark);
      },
      {
        body: UpsertBookmarkSchema
      }
    );

  return billController;
}

export default createBookmarkController;
