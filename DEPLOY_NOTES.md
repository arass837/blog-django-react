# Registration and post likes

This version adds public user registration and authenticated post likes.

## New API endpoints
- POST `/api/register/`
- POST `/api/posts/<slug>/like/`

## Database migration
The deployment must run:

```bash
python manage.py migrate
```

The existing Render build process already runs migrations if `backend/build.sh` is used.

## Permissions
- Everyone can read published posts and projects.
- Registered users can like/unlike posts.
- Only staff/admin users can create, edit, or delete posts/projects through the API.
