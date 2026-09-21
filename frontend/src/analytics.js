import api from './api';

const VISITOR_ID_KEY = 'reactodjango_visitor_id_v2';

function createVisitorId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = createVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function shouldSkipTracking() {
  // The site owner normally has an access token while managing the blog.
  // Avoid inflating public statistics with admin activity.
  return Boolean(localStorage.getItem('access_token'));
}

export async function trackSiteVisit() {
  if (shouldSkipTracking()) return;
  try {
    await api.post('views/track/', { visitor_id: getVisitorId() });
  } catch {
    // Analytics must never block the public site.
  }
}

export async function trackPostView(slug) {
  if (shouldSkipTracking() || !slug) return;
  try {
    await api.post('views/post/', {
      visitor_id: getVisitorId(),
      slug,
    });
  } catch {
    // Analytics must never block the article page.
  }
}
