import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../redux/reducers";
import {
  fetchPost,
  fetchCategories,
  savePost,
  IPost,
} from "../../redux/reducers/postsReducer";
import PostEditor from "../PostEditor/PostEditor";
import "./PostEditorPage.scss";

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
  const [categoryId, setCategoryId] = useState<number | null | "new">(null);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    console.log("Post state updated:", post);
  }, [post]);

  useEffect(() => {
    dispatch(fetchCategories());
    if (id !== null) dispatch(fetchPost(id)); // ✅ Use numeric ID
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategoryId(post.categoryId ?? null); // ✅ Directly use `categoryId`
    }
  }, [post]);

  const handleSave = async () => {
    let selectedCategory: number | null | "new" = categoryId;

    if (categoryId === "new" && newCategory.trim() !== "") {
      try {
        const response = await fetch("/category/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        });

        const data = await response.json();
        selectedCategory = data.id;
      } catch (error) {
        console.error("Error creating new category:", error);
        return;
      }
    }

    const newPost: IPost = {
      id: id ?? 0, // ✅ Ensure post has a valid ID
      title,
      content,
      categoryId: selectedCategory, // ✅ Only store category ID (not object)
      user: { id: 0, username: "" }, // Placeholder user (assume backend updates it)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: true,
    };

    dispatch(savePost(newPost, id ?? undefined)); // ✅ Pass numeric ID
    history.push(id ? `/view/${id}` : "/");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="blog-editor-page">
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
          value={categoryId ?? ""}
          onChange={(e) =>
            setCategoryId(
              e.target.value === "new" ? "new" : Number(e.target.value)
            )
          }
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="new">+ Add New Category</option>
        </select>

        {categoryId === "new" && (
          <input
            type="text"
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="new-category-input"
          />
        )}
      </div>
    </div>
  );
};

export default PostEditorPage;
