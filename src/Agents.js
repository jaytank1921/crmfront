import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from './Navbar';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

// Create a Supabase client instance
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Agents = () => {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
            id, name, content, created_at,
            replies (id, name, reply_content, created_at)
        `);
      setLoading(false);
      if (error) {
        setErrorMessage('Error fetching comments.');
        console.error(error);
      } else {
        setComments(data);
      }
    };

    fetchComments();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!author || !text) return;
  
    // Optimistically add the comment to the UI
    const newComment = { name: author, content: text, replies: [], id: Date.now() };
    setComments((prevComments) => [...prevComments, newComment]);
  
    setAuthor('');
    setText('');
  
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .insert([{ name: author, content: text }])
      .select('*');
  
    setLoading(false);
  
    if (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Error adding comment.');
    } else if (data && data.length > 0) {
      // Update the optimistic comment with the correct data from Supabase
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === newComment.id ? { ...data[0], replies: [] } : comment
        )
      );
    }
  };
  
  
  const handleReplySubmit = async (commentId, replyText) => {
    if (!author || !replyText) return;

    setLoading(true);
    const { data, error } = await supabase
        .from('replies')
        .insert([{ comment_id: commentId, name: author, reply_content: replyText }]);

    setLoading(false);
    if (error) {
        console.error('Error adding reply:', error.message);
        setErrorMessage('Error adding reply.');
        return;
    }

    // Make sure data is valid
    if (data && data.length > 0) {
        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, replies: [...comment.replies, data[0]] };
            }
            return comment;
        });
        setComments(updatedComments);
    }
};


  const ReplyComponent = ({ reply }) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        <strong>{reply.name}:</strong> {reply.reply_content}
      </Typography>
      <Typography variant="caption" color="text.secondary" className="timestamp">
        {new Date(reply.created_at).toLocaleString()}
      </Typography>
    </Box>
  );

  const CommentComponent = ({ comment }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');

    const submitReply = (e) => {
      e.preventDefault();
      handleReplySubmit(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    };

    return (
      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography variant="subtitle1">
          <strong>{comment.name}:</strong> {comment.content}
        </Typography>
        <Typography variant="caption" color="text.secondary" className="timestamp">
          {new Date(comment.created_at).toLocaleString()}
        </Typography>
        <Button onClick={() => setShowReplyInput(!showReplyInput)} sx={{ mt: 1 }}>
          {showReplyInput ? 'Cancel' : 'Reply'}
        </Button>
        {showReplyInput && (
          <Box component="form" onSubmit={submitReply} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              variant="outlined"
            />
            <Button type="submit" variant="contained" sx={{ mt: 1 }}>
              Submit Reply
            </Button>
          </Box>
        )}
        <List sx={{ mt: 2 }}>
          {comment.replies.map((reply) => (
            <ListItem key={reply.id} sx={{ pl: 0 }}>
              <ListItemText primary={<ReplyComponent reply={reply} />} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Paper>
    );
  };

  return (
    <div className="agents-section">
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Agents Page
      </Typography>
      <Typography variant="h5">Comments</Typography>
      {loading && <CircularProgress />}
      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
      <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <TextField
          label="Add a comment..."
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          sx={{ mt: 1 }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
      <div className="comments-list" style={{ marginTop: '20px' }}>
        {comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Agents;
