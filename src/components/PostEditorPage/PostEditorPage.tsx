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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const { post, categories, loading } = useSelector(
    (state: RootState) => state.posts
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [category, setCategory] = useState<ICategory | null>(null);

  const cropAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject("Canvas context not supported");
            return;
          }

          const BANNER_WIDTH = 1584;
          const BANNER_HEIGHT = 396;

          const aspectRatio = img.width / img.height;
          let newWidth = BANNER_WIDTH;
          let newHeight = BANNER_WIDTH / aspectRatio;

          if (newHeight < BANNER_HEIGHT) {
            newHeight = BANNER_HEIGHT;
            newWidth = BANNER_HEIGHT * aspectRatio;
          }

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = newWidth;
          tempCanvas.height = newHeight;
          const tempCtx = tempCanvas.getContext("2d");
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, newWidth, newHeight);
          }

          canvas.width = BANNER_WIDTH;
          canvas.height = BANNER_HEIGHT;
          ctx.drawImage(
            tempCanvas,
            (newWidth - BANNER_WIDTH) / 2,
            (newHeight - BANNER_HEIGHT) / 2,
            BANNER_WIDTH,
            BANNER_HEIGHT,
            0,
            0,
            BANNER_WIDTH,
            BANNER_HEIGHT
          );

          resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = () => reject("Image load error");
      };
      reader.onerror = () => reject("File read error");
    });
  };

  const base64ToFile = (base64String: string, filename: string): File => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    return new File([blob], filename, { type: "image/jpeg" });
  };

  useEffect(() => {
    dispatch(fetchCategories());
    if (id !== null) dispatch(fetchPost(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setCoverImage(post.coverImage ?? null);
    }
  }, [post]);

  useEffect(() => {
    if (categories.length > 0 && !category && !id) {
      setCategory(categories[0]);
    }
  }, [categories, id]);

  const handleAddCategory = async (categoryName: string) => {
    setIsAddingCategory(true);
    try {
      await dispatch(addCategory(categoryName));
      const updatedCategories = await dispatch(fetchCategories()) as ICategory[];
      
      const newCategory = updatedCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
      if (newCategory) {
        setCategory(newCategory);
        setToast({ message: 'Category added successfully!', type: 'success' });
        setIsCategoryModalOpen(false);
      } else {
        setToast({ message: 'Category added but not found. Please select it manually.', type: 'info' });
      }
    } catch (error) {
      setToast({ message: 'Failed to add category. Please try again.', type: 'error' });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSave = async () => {
    if (!category) {
      alert("Please select a category");
      return;
    }

    let imageBase64: string | null = null;

    if (coverImage) {
      const file = base64ToFile(coverImage, "cover.jpg");
      imageBase64 = await cropAndResizeImage(file);
    }

    const newPost: IPost = {
      id: id ?? uuid(),
      title,
      content,
      category,
      coverImage: imageBase64,
      user: { id: uuid(), username: "" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: true,
    };

    await dispatch(savePost(newPost, id ?? undefined));
    history.push(id ? `/post/view/${id}` : "/");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find(cat => cat.id === selectedId);
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  };

  if (loading) return <Loading />;

  const existingCategoryNames = categories.map(cat => cat.name.toLowerCase());

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
            {isAddingCategory ? 'Adding...' : '+ Add New'}
          </button>
        </div>
        <select
          value={category?.id ?? ""}
          onChange={handleCategoryChange}
          disabled={isAddingCategory}
        >
          <option value="" disabled>Select a category</option>
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
        existingCategories={categories.map(cat => cat.name.toLowerCase())}
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
