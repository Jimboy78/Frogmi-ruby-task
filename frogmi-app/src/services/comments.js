// Comments go to the Rails API when REACT_APP_API_URL is set; otherwise they live in this browser (static demo).
const API_URL = process.env.REACT_APP_API_URL;

export const COMMENTS_BACKEND = API_URL ? 'rails' : 'local';

const storageKey = (id) => `seismic-comments-${id}`;

function readLocal(id) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(id)) || '[]');
  } catch {
    return [];
  }
}

const endpoint = (id) => `${API_URL}/api/v1/earthquakes/${encodeURIComponent(id)}/comments`;

export async function fetchComments(id) {
  if (!API_URL) return readLocal(id);
  const res = await fetch(endpoint(id));
  if (res.status === 404) return [];
  if (!res.ok) throw new Error('Could not load comments.');
  return res.json();
}

export async function postComment(id, body) {
  if (API_URL) {
    const res = await fetch(endpoint(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: { body } }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || (data.errors || []).join(', ') || 'Failed to post comment.');
    return data;
  }

  const comment = { id: Date.now(), body, created_at: new Date().toISOString() };
  try {
    localStorage.setItem(storageKey(id), JSON.stringify([comment, ...readLocal(id)]));
  } catch {
    /* storage unavailable — keep it for this session only */
  }
  return comment;
}
