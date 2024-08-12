import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

// const [user, setUser] = useState(null);
export default function CirclePage() {
  const navigate = useNavigate();
  const { circleId } = useParams();
  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.body.style.background = 'none';

    axios.get(`http://127.0.0.1:7001/circle/GetCircleByID/${circleId}`)
      .then(response => {
        setCircle(response.data.circle);
        setPosts(response.data.posts);
        console.log('circle:', response.data.circle);
        console.log('posts:', response.data.posts);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [circleId]);
  if (!circle) {
    return <div>加载中...</div>;
  }
  function handleCreatePost() {
    navigate(`/PostForm/${circleId}`)
    window.location.reload();
  }

  function handleActivityPage() {
    navigate(`/ActivityPage/${circleId}`)
    window.location.reload();
  }
  function handleBackToMainPage() {
    navigate('/home');
    window.location.reload();
  }

  return (
    <div style={{ background: 'none' }}>
      <div>
        <h1 style={{ marginTop: '90px' }} >{circle.name}</h1>
        <button
          style={{ marginTop: '10px', color: 'black' }}
          onClick={handleActivityPage}
          className="rounded-lg w-full p-3 border"
        >
          查看成员活跃度
        </button>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        <button onClick={handleCreatePost}>
          发布帖子
        </button>
        <button onClick={handleBackToMainPage} style={{ marginLeft: '50px' }}>
          返回主页
        </button>
      </div>
    </div>
  );
}
const PostCard = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:7001/comment/GetCommentsByPostID/${post.id}`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, [post.id]);

  const addComment = (postId, text) => {
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }
    const storedUser = localStorage.getItem('user');
    console.log('storedUser:', storedUser);
    const user = JSON.parse(storedUser);
    console.log('user:', user);
    console.log('username:', user.data.username);
    const newComment = {
      postId,
      writer: user.data.username,
      text
    };
    console.log('111newComment:', newComment);
    axios.post('http://127.0.0.1:7001/comment/CreateComment', newComment, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setComments([...comments, response.data]);
      })
      .catch(error => {
        console.error('Error creating comment:', error);
      });
  };

  return (
    <div style={{ marginTop: '20px' }} className="mb-8 p-3 border rounded-lg">
      <div className="flex mb-3 items-center ">
        <div>
          <h4 className="text-lg font-bold">{post.writer}</h4>
          <p className="text-sm">{post.date}</p>
        </div>
      </div>
      <p className='border rounded-lg'>{post.content}</p>
      <div>
        {post.images.map((image, index) => (
          <img key={index} src={image} />
        ))}
      </div>
      <div>
        <h5 className="text-lg font-bold">评论</h5>
        {comments.map(comment => (
          <div key={comment.id}>
            <p style={{ fontSize: '14px' }}>{comment.writer}: {comment.text}</p>
          </div>
        ))}
        <div className="flex mt-3 items-center" style={{ color: 'black' }}>
          <input
            type="text"
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            className="w-full border  p-3 rounded-lg"
            placeholder="输入评论..."
          />
          <button style={{ color: 'black', marginLeft: '10px' }}
            onClick={() => {
              addComment(post.id, newCommentText);
              setNewCommentText('');
            }}
            className="rounded-lg w-20"
          >   发布
          </button>
        </div>
      </div>
    </div>
  );
};
function followCircle(circleId) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('请先登录');
    return;
  }
  fetch(`http://127.0.0.1:7001/api/circles/${circleId}/follow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应不正常');
      }
      return response.json(); // 确保返回 JSON 数据
    })
    .then(data => {
      if (data.success) {
        alert('关注成功');
        document.getElementById('followButton').disabled = true;
        document.getElementById('followButton').innerText = '已关注';
      } else {
        alert('关注失败: ' + data.message);
      }
    })
    .catch(error => {
      console.error('错误:', error);
      alert('发生错误: ' + error.message);
    });
}