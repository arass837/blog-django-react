const PostCard = ({ post }) => (
  <div id="first-post" className="post-card">
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <small>Autor: {post.author} | Data: {new Date(post.created_at).toLocaleString()}</small>
  </div>
);

export default PostCard;
