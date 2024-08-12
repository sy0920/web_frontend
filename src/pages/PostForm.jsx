import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function CreatePost() {
  const navigate = useNavigate();
  const { circleId } = useParams();
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('user');
    console.log('storedUser:', storedUser);
    const user = JSON.parse(storedUser);
    console.log('user:', user);
    const PostData = {
      circleId: parseInt(circleId),
      content: postText,
      images: [postImage],
      writer: user.data.username
    };

    axios.post('http://127.0.0.1:7001/post/CreatePost', PostData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log('Post created:', response.data);
        navigate(`/circle/${circleId}`)
      })
      .catch(error => {
        console.error('Error creating post:', error);
      });
  };

  return (
    <div>
      <h2 style={{ color: 'white', fontSize: '48px' }}>发帖子</h2>
      <form onSubmit={handleSubmit}>
        <textarea style={{ width: '100%', height: '200px' }}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="请输入..."
        />
        <input style={{ marginLeft: '-80px', marginTop: '10px' }}
          type="file"
          onChange={(e) => setPostImage(e.target.files[0])}
        />
        <button
          type="submit"
        >
          发帖
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
