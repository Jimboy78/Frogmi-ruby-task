import { useEffect, useRef, useState } from 'react';
import { COMMENTS_BACKEND, fetchComments, postComment } from '../services/comments';

export default function Comments({ quakeId }) {
  const [comments, setComments] = useState(null);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    let alive = true;
    setComments(null);
    fetchComments(quakeId)
      .then((list) => {
        if (alive) setComments([...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      })
      .catch((e) => {
        if (!alive) return;
        setComments([]);
        setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, [quakeId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Write something first.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const comment = await postComment(quakeId, body.trim());
      setComments((prev) => [comment, ...(prev ?? [])]);
      setBody('');
      input.current?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="panel">
      <h2 className="panel__title">
        Field notes {comments && <span className="count">{comments.length}</span>}
      </h2>
      <form className="comment-form" onSubmit={submit}>
        <textarea
          ref={input}
          rows={3}
          maxLength={500}
          placeholder="Felt it? Share what happened…"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error) setError('');
          }}
        />
        <div className="comment-form__row">
          <small className="muted">
            {COMMENTS_BACKEND === 'rails' ? 'Saved to the Rails API' : 'Demo mode · saved in this browser'}
          </small>
          <button className="btn" disabled={sending}>
            {sending ? 'Posting…' : 'Post note'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
      {comments && comments.length > 0 && (
        <ul className="comments">
          {comments.map((c) => (
            <li key={c.id}>
              <p>{c.body}</p>
              <small>{new Date(c.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
