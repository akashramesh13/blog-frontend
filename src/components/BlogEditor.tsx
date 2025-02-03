import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./BlogEditor.scss";

interface BlogEditorProps {
  content: string;
  setContent: (content: string) => void;
  saveBlog: () => void;
  title: string;
  setTitle: (title: string) => void;
  readOnly: boolean;
  isEditing: boolean;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  content,
  setContent,
  saveBlog,
  title,
  setTitle,
  readOnly,
  isEditing,
}) => {
  const modules = {
    toolbar: readOnly
      ? false
      : [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
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
          className="editor-title"
        />
      ) : (
        <h1>{title}</h1>
      )}

      <ReactQuill
        value={content}
        onChange={readOnly ? () => {} : setContent}
        modules={modules}
        readOnly={readOnly}
        placeholder="Write something amazing..."
      />
      {!readOnly && (
        <button className="save-button" onClick={saveBlog}>
          {isEditing ? "Update Blog" : "Publish Blog"}
        </button>
      )}
    </div>
  );
};

export default BlogEditor;
