import { t } from 'elysia';

import BookmarkDetailSchema from './BookmarkDetail';

const CreateBookmarkSchema = t.Object({
  bookmark: t.Object({
    bookmarks: t.Record(t.String(), BookmarkDetailSchema),
    bookmarkedCircleIds: t.Array(t.String())
  })
});

export default CreateBookmarkSchema;
