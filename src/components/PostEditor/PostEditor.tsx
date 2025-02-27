import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostEditor.scss";

interface PostEditorProps {
  content: string;
  setContent: (content: string) => void;
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
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCoverImage(reader.result.split(",")[1]);
        }
      };
    }
  };

  return (
    <div className="editor-container">
      {!readOnly ? (
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={readOnly}
          className="editor-container__editor-title"
          autoFocus
        />
      ) : (
        <h1>{title}</h1>
      )}

      {!readOnly && (
        <input type="file" accept="image/*" onChange={handleImageChange} />
      )}

      {coverImage && (
        <img
          src={`data:image/png;base64,${coverImage}`}
          alt="Cover"
          className="cover-preview"
        />
      )}

      <ReactQuill
        key={readOnly ? "readOnly" : "editable"}
        value={content}
        onChange={readOnly ? () => {} : setContent}
        modules={{
          toolbar: [
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
          "script",
        ]}
        readOnly={readOnly}
        placeholder="Write something amazing..."
      />

      {!readOnly && (
        <button className="save-button" onClick={saveBlog}>
          {isEditing ? "Update Post" : "Publish Post"}
        </button>
      )}
    </div>
  );
};

export default PostEditor;
