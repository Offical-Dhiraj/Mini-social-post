const CommentList = ({ comments = [] }) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    return null;
  }

  return (
    <div className="comment-list">

      {comments.map((comment, index) => {
        const username =
          comment.username ||
          comment.user?.username ||
          "User";

        return (
          <div
            className="comment-item"
            key={comment._id || index}
          >

            <div className="comment-avatar">
              {username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="comment-body">

              <div className="comment-bubble">

                <strong>
                  {username}
                </strong>

                <p>
                  {comment.content}
                </p>

              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default CommentList;