import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostEditor.scss";

interface PostEditorProps {
  content: string;
  setContent: (content: string) => void;
  saveBlog: () => void;
  title: string;
  setTitle: (title: string) => void;
  readOnly: boolean;
  isEditing: boolean;
}

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  },
};

const formats = [
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
];

const PostEditor: React.FC<PostEditorProps> = ({
  content,
  setContent,
  saveBlog,
  title,
  setTitle,
  readOnly,
  isEditing,
}) => {
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

      <ReactQuill
        key={readOnly ? "readOnly" : "editable"}
        value={content}
        onChange={readOnly ? () => {} : setContent}
        modules={modules}
        formats={formats}
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
