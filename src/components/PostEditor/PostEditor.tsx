import React, { useRef, useEffect, useCallback } from "react";
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
  const history = useHistory();

  const isDirtyRef = useRef(false);
  const isSavingRef = useRef(false);

  const handleSave = useCallback(() => {
    isSavingRef.current = true;
    isDirtyRef.current = false;
    saveBlog();
  }, [saveBlog]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
        if (!isSavingRef.current) {
          isDirtyRef.current = true;
        }
      }
    };
  };

  useEffect(() => {
    if (readOnly) return;

    const unblock = history.block(() => {
      if (isSavingRef.current) return;

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
        if (!readOnly) handleSave();
      }
    };

    window.addEventListener("keydown", handleSaveShortcut);
    return () => window.removeEventListener("keydown", handleSaveShortcut);
  }, [readOnly, handleSave]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSavingRef.current) return;

      if (!isDirtyRef.current) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className="editor-container">
      {/* TITLE */}
      {!readOnly ? (
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);

            if (!isSavingRef.current) {
              isDirtyRef.current = true;
            }
          }}
          ref={titleRef}
          className="editor-container__editor-title"
          autoFocus
        />
      ) : (
        <h1>{title}</h1>
      )}

      {/* IMAGE UPLOAD */}
      {!readOnly && (
        <label className="image-upload">
          <span>+ Add cover image</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      )}

      {/* IMAGE PREVIEW */}
      {coverImage && (
        <img src={coverImage} alt="Cover" className="cover-preview" />
      )}

      {/* EDITOR */}
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={(value, delta, source, editor) => {
          if (!readOnly && !isSavingRef.current) {
            setContent(editor.getContents());

            if (source === "user") {
              isDirtyRef.current = true;
            }
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

      {/* SAVE BUTTON */}
      {!readOnly && (
        <button className="save-button" onClick={handleSave}>
          {isEditing ? "Update Post" : "Publish Post"}
        </button>
      )}
    </div>
  );
};

export default PostEditor;
