import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import {
  fetchPost,
  fetchCategories,
  savePost,
  IPost,
  ICategory,
} from "../../redux/reducers/postsReducer";
import PostEditor from "../PostEditor/PostEditor";
import "./PostEditorPage.scss";
import Loading from "../Loading/Loading";

const PostEditorPage: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? Number(idParam) : null;
  const dispatch: any = useDispatch();
  const history = useHistory();

  const { post, categories, loading } = useSelector(
    (state: RootState) => state.posts
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ICategory>({
    id: 1,
    name: "food",
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (id !== null) dispatch(fetchPost(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
    }
  }, [post]);

  const handleSave = async () => {
    let selectedCategory: ICategory = category;

    const newPost: IPost = {
      id: id ?? 0,
      title,
      content,
      category: selectedCategory,
      user: { id: 0, username: "" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: true,
    };

    await dispatch(savePost(newPost, id ?? undefined));
    history.push(id ? `/view/${id}` : "/");
  };

  if (loading) return <Loading />;

  return (
    <div className="post-editor-page">
      <PostEditor
        content={content}
        setContent={setContent}
        saveBlog={handleSave}
        title={title}
        setTitle={setTitle}
        readOnly={!!id && !post?.owner}
        isEditing={!!id}
      />

      <div className="category-selector">
        <label>Category:</label>
        <select
          value={category.id ?? 0}
          onChange={(e) =>
            setCategory(
              categories.find((cat) => cat.id === Number(e.target.value)) ?? {
                id: 1,
                name: "food",
              }
            )
          }
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PostEditorPage;
