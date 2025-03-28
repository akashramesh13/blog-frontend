import React from 'react';
import moment from 'moment';
import { IPost } from '../../types/postsTypes';

const stripHtmlAndTruncate = (html: string, maxLength: number = 100) => {
  const plainText = html.replace(/<\/?[^>]+(>|$)/g, '').trim();
  return plainText.length > maxLength ? `${plainText.substring(0, maxLength)}...` : plainText;
};

interface PostProps {
  post: IPost;
  handleOnPostClick: (post: IPost) => void;
}

const Post: React.FC<PostProps> = ({ post, handleOnPostClick }) => {
  return (
    <div className="home__post" onClick={() => handleOnPostClick(post)}>
      <h2 className="home__post-title">{post.title}</h2>
      <p className="home__post-excerpt">{stripHtmlAndTruncate(post.content, 20)}</p>
      <span className="home__post-date">{moment(post.createdAt).format('DD MMM, YY')}</span>
    </div>
  );
};

export default Post;
