import { Elysia } from 'elysia';
import type { BookmarkService } from '../services/BookmarkService';

function createBookmarkPlugin(bookmarkService: BookmarkService) {
  const circlePlugin = new Elysia({
    name: 'bookmarkPlugin'
  }).decorate('bookmarkService', bookmarkService);

  return circlePlugin;
}

export default createBookmarkPlugin;
