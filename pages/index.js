import Loader from '../components/Loader';
import { useState } from 'react';
import { firestore, postToJSON, fromMillis } from '../lib/firebase';
import PostFeed from '../components/PostFeed';
import MetaTags from '../components/Metatags';

const LIMIT = 10;

export async function getServerSideProps(context) {
    const postsQuery = firestore
        .collectionGroup('posts')
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(LIMIT);

    const posts = (await postsQuery.get()).docs.map(postToJSON);

    return {
        props: { posts },
    };
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);

    const [postEnd, setPostsEnd] = useState(false);
    
    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

        const query = firestore
            .collectionGroup('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .startAfter(cursor)
            .limit(LIMIT);

        const newPosts = (await query.get()).docs.map((doc) => doc.data());

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

    return (
        <main>
            <PostFeed posts={posts} />
            <MetaTags title="Home Page" description="Get the latest posts on our site" />

            <div className="card card-info">
                <h2>Next.js + Firebase</h2>
                <p>Welcome! This app is built with Next.js and Firebase</p>
                <p>Sign up an account, writre posts and heart content created by other users</p>
            </div>
            <PostFeed posts={posts} />

            {!loading && !postEnd && <button onClick={getMorePosts}>Load more</button>}

            <Loader show={loading} />

            {postEnd && 'You have reached the end!'}
        </main>
    );
}