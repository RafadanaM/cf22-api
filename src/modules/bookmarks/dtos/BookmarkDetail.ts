import { t } from 'elysia';

const BookmarkDetailSchema = t.Object({
  isComplete: t.Boolean(),
  id: t.String(),
  note: t.String()
});

export default BookmarkDetailSchema;
