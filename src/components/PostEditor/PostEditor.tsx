import React, { useRef, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostEditor.scss";
import { useHistory } from "react-router-dom";
import ImageCropper from "../ImageCropper/ImageCropper";
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { FiEdit3 } from "react-icons/fi";

import type { DeltaStatic } from "quill";

interface PostEditorProps {
  content: string | DeltaStatic | any;
  setContent: (content: string | DeltaStatic | any) => void;
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
  const quillRef = useRef<ReactQuill | null>(null);
  const history = useHistory();

  const isDirtyRef = useRef(false);
  const isSavingRef = useRef(false);

  // Cropper state
  const [showCropper, setShowCropper] = React.useState(false);
  const [tempImageSrc, setTempImageSrc] = React.useState<string | null>(null);
  const [showConfirmDiscard, setShowConfirmDiscard] = React.useState(false);
  const [pendingLocation, setPendingLocation] = React.useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setTempImageSrc(reader.result);
        setShowCropper(true);
      }
    };
    // reset input so the same file can be selected again
    event.target.value = "";
  };

  const handleCropComplete = (croppedBase64: string) => {
    setCoverImage(croppedBase64);
    if (!isSavingRef.current) {
      isDirtyRef.current = true;
    }
    setShowCropper(false);
    setTempImageSrc(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc(null);
  };

  useEffect(() => {
    if (readOnly) return;

    const unblock = history.block((tx) => {
      if (isSavingRef.current) return;
      if (!isDirtyRef.current) return;

      setPendingLocation(tx.pathname);
      setShowConfirmDiscard(true);
      return false; // Block route transition and trigger our custom ConfirmModal
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

  const titleHeadingRef = useRef<HTMLHeadingElement>(null);

  // Sync title prop to contentEditable innerText
  useEffect(() => {
    if (titleHeadingRef.current && titleHeadingRef.current.innerText !== title) {
      titleHeadingRef.current.innerText = title;
    }
  }, [title]);

  return (
    <div className="editor-container">
      {/* GLOBAL ACTIONS */}
      {!readOnly && (
        <div className="editor-top-bar">
          <div className="editor-actions">
            <button className="discard-button" onClick={() => {
              if (isDirtyRef.current) {
                setShowConfirmDiscard(true);
              } else {
                history.push('/');
              }
            }}>
              Discard
            </button>
            <button className="save-button" onClick={handleSave}>
              {isEditing ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      )}

      {/* HEADER: TITLE */}
      <div className="editor-header">
        {!readOnly ? (
          <>
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h1
              ref={titleHeadingRef}
              contentEditable
              suppressContentEditableWarning
              className="editor-container__editor-title"
              data-placeholder="Enter Title"
              onInput={(e) => {
                const text = e.currentTarget.innerText.replace(/\n/g, "");
                setTitle(text);
                if (!isSavingRef.current) {
                  isDirtyRef.current = true;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
          </>
        ) : (
          <h1>{title}</h1>
        )}
      </div>

      {/* IMAGE UPLOAD */}
      {!readOnly && (
        <label className="image-upload">
          <div
            className="image-upload__placeholder"
            onClick={() => fileInputRef.current?.click()}
          >
            <span>
              {coverImage ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {FiEdit3({ style: { fontSize: '0.95rem' } })} Update Cover Image
                </span>
              ) : (
                "+ Add Cover Image"
              )}
            </span>
          </div>
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>
      )}

      {/* IMAGE PREVIEW */}
      {coverImage && (
        <img src={coverImage} alt="Cover" className="cover-preview" />
      )}

      {/* CROPPER MODAL */}
      {showCropper && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={21 / 9} // Banner aspect ratio similar to LinkedIn
        />
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal 
         isOpen={showConfirmDiscard} 
         onClose={() => {
            setShowConfirmDiscard(false);
            setPendingLocation(null);
         }} 
         onConfirm={() => {
            isDirtyRef.current = false;
            setShowConfirmDiscard(false);
            if (pendingLocation) {
              history.push(pendingLocation);
              setPendingLocation(null);
            } else {
              history.push('/');
            }
         }} 
         title="Discard Changes" 
         message="Are you sure you want to discard your unsaved changes? This action cannot be undone." 
         confirmText="Discard" 
      />

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
    </div>
  );
};

export default PostEditor;
