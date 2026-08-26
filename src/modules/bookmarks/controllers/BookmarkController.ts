import { Elysia } from 'elysia';

import type createAppPlugin from '@plugins/appPlugin';

import type createBookmarkPlugin from '../plugins/BookmarkPlugin';
import CreateBookmarkSchema from '../dtos/CreateBookmarkDTO';
import UpsertBookmarkSchema from '../dtos/UpsertBookmarkDTO';

function createBookmarkController(
  appPlugin: ReturnType<typeof createAppPlugin>,
  bookmarkPlugin: ReturnType<typeof createBookmarkPlugin>
) {
  const bookmarkController = new Elysia({ prefix: '/bookmarks' })
    .use(appPlugin)
    .use(bookmarkPlugin)
    .get('/:id', ({ bookmarkService, params: { id } }) => {
      return bookmarkService.getBookmark(id);
    })
    .post(
      '',
      ({ bookmarkService, body }) => {
        return bookmarkService.createBookmark(body.bookmark);
      },
      {
        body: CreateBookmarkSchema
      }
    )
    .put(
      '/:id',
      ({ bookmarkService, params: { id }, body }) => {
        return bookmarkService.upsertBookmark(id, body.bookmark);
      },
      {
        body: UpsertBookmarkSchema
      }
    );

  return bookmarkController;
}

export default createBookmarkController;
