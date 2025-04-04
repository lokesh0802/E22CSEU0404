const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;

const API_URL = 'http://20.244.56.144/evaluation-service';

app.get('/users', async (req, res) => {
    try {

        const usersResponse = await axios.get(`${API_URL}/users`);
        const users = usersResponse.data.users;

        let userPostCounts = [];

        for (const [userId, userName] of Object.entries(users)) {
            const postsResponse = await axios.get(`${API_URL}/users/${userId}/posts`);
            const posts = postsResponse.data.posts || [];
            
            userPostCounts.push({
                id: userId,
                name: userName,
                postCount: posts.length
            });
        }

        userPostCounts.sort((a, b) => b.postCount - a.postCount);
        const topUsers = userPostCounts.slice(0, 5);
        
        res.json(topUsers);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const type = req.query.type;

        if (type !== 'popular' && type !== 'latest') {
            return res.status(400).json({ error: 'Type must be popular or latest' });
        }

        const usersResponse = await axios.get(`${API_URL}/users`);
        const users = usersResponse.data.users;

        let allPosts = [];
        for (const userId of Object.keys(users)) {
            const postsResponse = await axios.get(`${API_URL}/users/${userId}/posts`);
            const userPosts = postsResponse.data.posts || [];
            allPosts = allPosts.concat(userPosts);
        }

        if (type === 'latest') {

            allPosts.sort((a, b) => b.id - a.id);
            return res.json(allPosts.slice(0, 5));
        }

        if (type === 'popular') {

            let postsWithComments = [];
            for (const post of allPosts) {
                const commentsResponse = await axios.get(`${API_URL}/posts/${post.id}/comments`);
                const comments = commentsResponse.data.comments || [];
                postsWithComments.push({
                    ...post,
                    commentCount: comments.length
                });
            }


            const maxComments = Math.max(...postsWithComments.map(p => p.commentCount));
            const mostCommentedPosts = postsWithComments.filter(p => p.commentCount === maxComments);
            
            res.json(mostCommentedPosts);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
