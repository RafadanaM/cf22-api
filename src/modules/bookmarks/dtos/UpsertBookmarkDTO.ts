import { t } from 'elysia';

const BookmarkDetailSchema = t.Object({
  isComplete: t.Boolean(),
  id: t.String(),
  note: t.String()
});

const UpsertBookmarkSchema = t.Object({
  bookmark: t.Object({
    bookmarkId: t.String(),
    bookmarks: t.Record(t.String(), BookmarkDetailSchema),
    bookmarkedCircleIds: t.Array(t.String())
  })
});

export default UpsertBookmarkSchema;
