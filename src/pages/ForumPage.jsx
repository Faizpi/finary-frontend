import { visualAssets } from '../constants'
import { compactDate } from '../lib/format'

export default function ForumPage({
  forumForm,
  forumPosts,
  forumReplyForms,
  handleForumReplySubmit,
  handleForumSubmit,
  loading,
  setForumForm,
  setForumReplyForms,
  t,
}) {
  return (
          <section className="panel stack">
            <div className="split-grid duo">
              <form className="inset form-grid form-tight" onSubmit={handleForumSubmit}>
                <h3>{t('Post Baru', 'New Post')}</h3>
                <label>
                  {t('Judul', 'Title')}
                  <input
                    value={forumForm.title}
                    onChange={(e) => setForumForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder={t('Judul diskusi kamu', 'Title of your discussion')}
                    required
                  />
                </label>
                <label>
                  {t('Isi', 'Content')}
                  <textarea
                    value={forumForm.body}
                    onChange={(e) => setForumForm((prev) => ({ ...prev, body: e.target.value }))}
                    placeholder={t('Tulis pertanyaan atau tips keuanganmu', 'Write your question or financial tips')}
                    required
                  />
                </label>
                <label>
                  {t('Tags (pisah koma)', 'Tags (comma separated)')}
                  <input
                    value={forumForm.tags}
                    onChange={(e) => setForumForm((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder={t('Topik terkait, pisahkan dengan koma', 'Related topics, separated by commas')}
                  />
                </label>
                <button className="button" disabled={loading}>{t('Publikasikan', 'Publish')}</button>
              </form>

              <article className="inset forum-info">
                <h3>{t('Komunitas Finary', 'Finary Community')}</h3>
                <img
                  className="forum-illustration"
                  src={visualAssets.forum}
                  alt={t('Ilustrasi forum', 'Forum illustration')}
                  loading="lazy"
                />
                <p className="helper">{t('Diskusi, tanya, dan berbagi tips keuangan bersama pengguna lain.', 'Discuss, ask, and share financial tips with others.')}</p>
              </article>
            </div>

            <div className="forum-list">
              {forumPosts.map((post) => (
                <article key={post.id} className="forum-item">
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                  {!!(post.tags || []).length && (
                    <div className="forum-tags">
                      {(post.tags || []).map((tag) => (
                        <span className="forum-tag" key={`${post.id}-${tag}`}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="forum-replies">
                    {(post.replies || []).length === 0 && (
                      <p className="helper">{t('Belum ada balasan.', 'No replies yet.')}</p>
                    )}

                    {(post.replies || []).map((reply) => (
                      <div className="forum-reply" key={reply.id}>
                        <div className="meta">
                          <span>{reply.user?.name || '-'}</span>
                          <span>{compactDate(reply.created_at)}</span>
                        </div>
                        <p>{reply.body}</p>
                      </div>
                    ))}
                  </div>

                  <form
                    className="forum-reply-form"
                    onSubmit={(event) => handleForumReplySubmit(event, post.id)}
                  >
                    <input
                      value={forumReplyForms[post.id] || ''}
                      onChange={(event) =>
                        setForumReplyForms((prev) => ({
                          ...prev,
                          [post.id]: event.target.value,
                        }))
                      }
                      placeholder={t('Tulis balasan...', 'Write a reply...')}
                      maxLength={1000}
                    />
                    <button className="button tiny" disabled={loading}>{t('Balas', 'Reply')}</button>
                  </form>

                  <div className="meta">
                    <span>{t('oleh', 'by')} {post.user?.name || '-'}</span>
                    <span>{compactDate(post.created_at)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
  )
}
