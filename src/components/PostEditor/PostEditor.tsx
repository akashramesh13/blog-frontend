import React, { useRef, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostEditor.scss";
import { useHistory } from "react-router-dom";
import ImageCropper from "../ImageCropper/ImageCropper";
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { FiEdit3 } from "react-icons/fi";

import Quill, { DeltaStatic } from "quill";

const Inline = Quill.import('blots/inline') as any;
class DropcapBlot extends Inline {
  static create(value: boolean) {
    let node = super.create();
    if (value) {
      node.setAttribute('class', 'dropcap');
    }
    return node;
  }
  static formats(node: HTMLElement) {
    return node.classList.contains('dropcap');
  }
}
DropcapBlot.blotName = 'dropcap';
DropcapBlot.tagName = 'span';
DropcapBlot.className = 'dropcap';
Quill.register(DropcapBlot);

interface PostEditorProps {
  content: string | DeltaStatic | any;
  setContent: (content: string | DeltaStatic | any) => void;
  saveBlog: () => void;
  title: string;
  setTitle: (title: string) => void;
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
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
  subtitle,
  setSubtitle,
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
  const [isFloating, setIsFloating] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const dropcapBtn = document.querySelector('.ql-dropcap');
    if (dropcapBtn && !dropcapBtn.innerHTML) {
      dropcapBtn.innerHTML = '<span style="font-family: var(--font-aeon-serif); font-weight: bold; font-size: 16px; line-height: 1; color: #888;">D</span>';
    }
  }, []);

  const titleHeadingRef = useRef<HTMLHeadingElement>(null);

  // Sync title prop to contentEditable innerText
  useEffect(() => {
    if (titleHeadingRef.current && titleHeadingRef.current.innerText !== title) {
      titleHeadingRef.current.innerText = title;
    }
  }, [title]);

  const modules = React.useMemo(() => ({
    toolbar: readOnly
      ? false
      : [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block", "dropcap"],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ]
  }), [readOnly]);

  const formats = React.useMemo(() => [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "code-block",
    "dropcap",
  ], []);

  return (
    <div className="editor-container">
      {/* GLOBAL ACTIONS */}
      {!readOnly && (
        <div className={`editor-top-bar ${isFloating ? "editor-top-bar--floating" : ""}`}>
          <div className="editor-actions">
            <button className="btn-action" onClick={() => {
              if (isDirtyRef.current) {
                setShowConfirmDiscard(true);
              } else {
                if (history.length > 2) history.goBack();
                else history.push('/');
              }
            }}>
              Discard
            </button>
            <button className="btn-action" onClick={handleSave}>
              {isEditing ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      )}

      {/* HEADER: TITLE & SUBTITLE */}
      <div className="editor-header">
        {!readOnly ? (
          <>
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h1
              ref={titleHeadingRef}
              contentEditable
              suppressContentEditableWarning
              className="editor-container__editor-title"
              data-placeholder="Title"
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
            <input
              type="text"
              className="editor-container__editor-subtitle"
              placeholder="Subtitle (optional)"
              value={subtitle}
              onChange={(e) => {
                setSubtitle(e.target.value);
                if (!isSavingRef.current) {
                  isDirtyRef.current = true;
                }
              }}
            />
          </>
        ) : (
          <>
            <h1>{title}</h1>
            {subtitle && <h2 className="editor-container__editor-subtitle-display">{subtitle}</h2>}
          </>
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
          aspectRatio={16 / 9} // Full section hero aspect ratio
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
              if (history.length > 2) history.goBack();
              else history.push('/');
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
          if (!readOnly && !isSavingRef.current && source === "user") {
            setContent(editor.getContents());
            isDirtyRef.current = true;
          }
        }}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        placeholder="Write something amazing..."
      />
    </div>
  );
};

export default PostEditor;
