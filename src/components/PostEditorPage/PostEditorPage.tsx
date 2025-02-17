import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "../../helpers/axios";
import PostEditor from "../PostEditor/PostEditor";

const BlogEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [owner, setOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/posts/${id}`);
        if (!data.owner) {
          const redirectUrl = `/post/view/${id}`;
          history.push({
            pathname: redirectUrl,
          });
        }
        setTitle(data.title);
        setContent(data.content);
        setOwner(data.owner);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const saveBlog = async () => {
    const method = id ? "PUT" : "POST";
    const url = id ? `/posts/${id}` : "/posts";

    try {
      await axios({
        method,
        url,
        data: { title, content, category: { id: 1, name: "technology" } },
      });
      history.push(id ? `/view/${id}` : "/");
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="blog-editor-page">
      <PostEditor
        content={content}
        setContent={setContent}
        saveBlog={saveBlog}
        title={title}
        setTitle={setTitle}
        readOnly={!!id && !owner}
        isEditing={!!id}
      />
    </div>
  );
};

export default BlogEditorPage;
