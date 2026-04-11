import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostEditor.scss";
import useInputRef from "../../hooks/useInputRef";
import { useHistory } from "react-router-dom";

interface PostEditorProps {
  content: any;
  setContent: (content: any) => void;
  saveBlog: () => void;
  title: string;
  setTitle: (title: string) => void;
  coverImage: string | null;
  setCoverImage: (image: string | null) => void;
  readOnly: boolean;
  isEditing: boolean;
}

const PostEditor: React.FC<PostEditorProps> = ({
  content,
  setContent,
  saveBlog,
  title,
  setTitle,
  coverImage,
  setCoverImage,
  readOnly,
  isEditing,
}) => {
  const titleRef = useInputRef();
  const quillRef = useRef<ReactQuill | null>(null);
  const isDirtyRef = useRef(false);
  const history = useHistory();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCoverImage(reader.result.split(",")[1]);
          isDirtyRef.current = true;
        }
      };
    }
  };

  useEffect(() => {
    if (readOnly) return;

    const unblock = history.block(() => {
      if (!isDirtyRef.current) return;

      return "You have unsaved changes. Are you sure you want to leave?";
    });

    return () => {
      unblock();
    };
  }, [history, readOnly]);

  useEffect(() => {
    const handleSaveShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!readOnly) {
          handleSave();
        }
      }
    };

    window.addEventListener("keydown", handleSaveShortcut);

    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [readOnly, saveBlog]);

  // 🔥 refresh / close warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 🔥 wrapped save (reset dirty)
  const handleSave = () => {
    saveBlog();
    isDirtyRef.current = false;
  };

  return (
    <div className="editor-container">
      {!readOnly ? (
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            isDirtyRef.current = true;
          }}
          ref={titleRef}
          className="editor-container__editor-title"
          autoFocus
        />
      ) : (
        <h1>{title}</h1>
      )}

      {!readOnly && (
        <label className="image-upload">
          <span>+ Add cover image</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      )}

      {coverImage && (
        <img
          src={`data:image/png;base64,${coverImage}`}
          alt="Cover"
          className="cover-preview"
        />
      )}

      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={(value, delta, source, editor) => {
          if (!readOnly) {
            setContent(editor.getContents());
            isDirtyRef.current = true;
          }
        }}
        modules={{
          toolbar: readOnly
            ? false
            : [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote", "code-block"],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ align: [] }],
                ["link"],
                ["clean"],
              ],
        }}
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "align",
          "link",
          "image",
          "code-block",
        ]}
        readOnly={readOnly}
        placeholder="Write something amazing..."
      />

      {!readOnly && (
        <button className="save-button" onClick={handleSave}>
          {isEditing ? "Update Post" : "Publish Post"}
        </button>
      )}
    </div>
  );
};

export default PostEditor;
