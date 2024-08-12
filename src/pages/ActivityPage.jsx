import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const CirclePostCountsTable = () => {
    const { circleId } = useParams();
    const [postCounts, setPostCounts] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`http://127.0.0.1:7001/circle/${circleId}/post-counts`)
            .then(response => {
                setPostCounts(response.data);
            })
            .catch(error => {
                console.error('Error fetching post counts:', error);
            });
    }, [circleId]);

    if (!postCounts) {
        return <div>Loading...</div>;
    }

    function handleBackToMainPage() {
        navigate('/home');
        // window.location.reload();
    }
    return (
        <div style={{ color: 'white' }}>
            <h1 style={{ fontSize: '56px' }}>{postCounts.circleName}圈</h1>
            <table style={{ marginTop: '20px', fontSize: '30px' }}>
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>活跃度（发帖数）</th>
                    </tr>
                </thead>
                <tbody>
                    {postCounts.memberPostCounts.map(member => (
                        <tr key={member.memberId}>
                            <td style={{ paddingRight: '40px' }}>{member.username}</td>
                            <td>{member.postCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleBackToMainPage} style={{ color: 'black' }}>
                返回主页
            </button>
        </div>
    );
};

export default CirclePostCountsTable;