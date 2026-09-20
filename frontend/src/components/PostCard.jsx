const PostCard = ({ post }) => (
  <div id="first-post" className="post-card">
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <small>
      Author: {post.author_name || 'Author'}
      {post.created_at && ` | Date: ${new Date(post.created_at).toLocaleString('en-US')}`}
    </small>
  </div>
);

export default PostCard;
