import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import {
  fetchPost,
  fetchCategories,
  savePost,
  addCategory,
} from "../../redux/actions/postsActions";
import PostEditor from "../PostEditor/PostEditor";
import CategoryModal from "../CategoryModal/CategoryModal";
import Toast from "../Toast/Toast";
import "./PostEditorPage.scss";
import Loading from "../Loading/Loading";
import { ICategory, IPost } from "../../types/postsTypes";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { v4 as uuid } from "uuid";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const PostEditorPage: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? idParam : null;
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const { post, categories, loading } = useSelector(
    (state: RootState) => state.posts,
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>({ ops: [{ insert: "\n" }] });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [category, setCategory] = useState<ICategory | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    if (id !== null && post?.id !== id) {
      dispatch(fetchPost(id));
    }
  }, [id, dispatch, post?.id]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);

      try {
        const parsed =
          typeof post.content === "string"
            ? JSON.parse(post.content)
            : post.content;

        setContent(parsed);
      } catch {
        setContent({ ops: [{ insert: "\n" }] });
      }

      setCategory(post.category);
      setCoverImage(post.coverImage ?? null);
    }
  }, [post]);

  useEffect(() => {
    if (categories.length > 0 && !category && !id) {
      setCategory(categories[0]);
    }
  }, [categories, id, category]);

  const handleAddCategory = async (categoryName: string) => {
    setIsAddingCategory(true);
    try {
      await dispatch(addCategory(categoryName));
      const updatedCategories = (await dispatch(
        fetchCategories(),
      )) as ICategory[];

      const newCategory = updatedCategories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase(),
      );
      if (newCategory) {
        setCategory(newCategory);
        setToast({ message: "Category added successfully!", type: "success" });
        setIsCategoryModalOpen(false);
      } else {
        setToast({
          message: "Category added but not found. Please select it manually.",
          type: "info",
        });
      }
    } catch (error) {
      setToast({
        message: "Failed to add category. Please try again.",
        type: "error",
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSave = async () => {
    if (!category) {
      alert("Please select a category");
      return;
    }

    let imageBase64: string | null = coverImage;

    const newPost: Partial<IPost> = {
      id: id ?? uuid(),
      title,
      content: JSON.stringify(content),
      category,
      coverImage: imageBase64,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: true,
    };

    try {
      await dispatch(savePost(newPost as IPost, id ?? undefined));
      setToast({ message: "Post saved successfully!", type: "success" });
      setTimeout(() => history.push(id ? `/post/view/${id}` : "/"), 1000);
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.error || "Failed to save post. Please ensure all fields are filled.",
        type: "error",
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find((cat) => cat.id === selectedId);
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  };

  if (loading && post?.id !== id) return <Loading />;

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
        coverImage={coverImage}
        setCoverImage={setCoverImage}
      />

      <div className="category-selector">
        <div className="category-header">
          <label>Category:</label>
          <button
            className="add-category-button"
            onClick={() => setIsCategoryModalOpen(true)}
            disabled={isAddingCategory}
          >
            {isAddingCategory ? "Adding..." : "+ Add New"}
          </button>
        </div>
        <select
          value={category?.id ?? ""}
          onChange={handleCategoryChange}
          disabled={isAddingCategory}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAdd={handleAddCategory}
        existingCategories={categories.map((cat) => cat.name.toLowerCase())}
        isLoading={isAddingCategory}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PostEditorPage;
