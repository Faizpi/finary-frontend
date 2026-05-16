import { useCallback } from 'react'
import { forumApi } from '../lib/api'
import { splitCsv } from '../lib/helpers'

/**
 * Handles forum post and reply submission.
 */
export function useForumActions({
  forumForm,
  setForumForm,
  forumReplyForms,
  setForumReplyForms,
  guardedAction,
  refreshForum,
  setError,
  setMessage,
  t,
}) {
  const handleForumSubmit = useCallback(async (event) => {
    event.preventDefault()

    await guardedAction(async () => {
      await forumApi.create({
        ...forumForm,
        tags: splitCsv(forumForm.tags),
      })
      setForumForm({ title: '', body: '', tags: '' })
    }, t('Postingan forum berhasil dipublikasikan.', 'Forum post published successfully.'), refreshForum)
  }, [forumForm, setForumForm, guardedAction, refreshForum, t])

  const handleForumReplySubmit = useCallback(async (event, postId) => {
    event.preventDefault()

    const body = (forumReplyForms[postId] || '').trim()

    if (!body) {
      setError(t('Balasan tidak boleh kosong.', 'Reply cannot be empty.'))
      setMessage('')
      return
    }

    await guardedAction(async () => {
      await forumApi.reply(postId, { body })
      setForumReplyForms((prev) => ({ ...prev, [postId]: '' }))
    }, t('Balasan forum berhasil dikirim.', 'Forum reply sent successfully.'), refreshForum)
  }, [forumReplyForms, setForumReplyForms, guardedAction, refreshForum, setError, setMessage, t])

  return { handleForumSubmit, handleForumReplySubmit }
}
