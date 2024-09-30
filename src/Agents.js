import React, { useState } from 'react';
import Navbar from './Navbar';
import './Agents.css';



// Main Agents Component
const Agents = () => {
    const [comments, setComments] = useState([]);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            id: Date.now(), // Unique ID for each comment
            author: author,
            text: text,
            timestamp: new Date().toLocaleString(),
            replies: [],
        };
        setComments([...comments, newComment]);
        setAuthor('');
        setText('');
    };
    // Reply Component
const Reply = ({ reply }) => {
  return (
      <div className="reply">
          <p><strong>{reply.author}:</strong> {reply.text}</p>
          <p className="timestamp">{reply.timestamp}</p>
      </div>
  );
};

// Comment Component
const Comment = ({ comment, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e) => {
      e.preventDefault();
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
  };

  return (
      <div className="comment">
          <p><strong>{comment.author}:</strong> {comment.text}</p>
          <p className="timestamp">{comment.timestamp}</p>
          <button onClick={() => setShowReplyInput(!showReplyInput)}>
              {showReplyInput ? 'Cancel' : 'Reply'}
          </button>
          {showReplyInput && (
              <form onSubmit={handleReplySubmit}>
                  <textarea
                      placeholder="Add a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                  />
                  <button type="submit">Submit Reply</button>
              </form>
          )}
          <div className="replies-list">
              {comment.replies.map((reply, index) => (
                  <Reply key={index} reply={reply} />
              ))}
          </div>
      </div>
  );
};

    const handleReplySubmit = (commentId, replyText) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                const newReply = {
                    author: author,
                    text: replyText,
                    timestamp: new Date().toLocaleString(),
                };
                return { ...comment, replies: [...comment.replies, newReply] };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    return (
        <div className="agents-section">
            <Navbar />
            <h1>Agents Page</h1>
            <h2>Comments</h2>
            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Add a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <div className="comments-list">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} onReply={handleReplySubmit} />
                ))}
            </div>
        </div>
    );
};

export default Agents;
