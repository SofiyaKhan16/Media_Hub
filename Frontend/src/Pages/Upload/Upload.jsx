import { useState, useCallback } from "react";
import FilePreview from "../../Components/FilePreview";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { uploadMediaFile } from "../../api/mediaFile.js";

function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const user = useSelector(state => state.user.user);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);

    if (fileRejections && fileRejections.length > 0) {
      const reason = fileRejections[0].errors[0];
      if (reason && reason.code === "file-too-large") {
        setError("File size exceeds the 100MB limit.");
        return;
      } else {
        setError(reason && reason.message ? reason.message : "File not accepted.");
        return;
      }
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      let preview = null;
      const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
      const fileName = selectedFile.name.toLowerCase();
      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type.startsWith("video/") ||
        selectedFile.type.startsWith("audio/") ||
        selectedFile.type === "application/pdf" ||
        audioExtensions.some(ext => fileName.endsWith(ext)) ||
        fileName.endsWith('.pdf')
      ) {
        preview = URL.createObjectURL(selectedFile);
      }
      setFile({
        file: selectedFile,
        id: Math.random().toString(36).substr(2, 9),
        preview,
        tags: [],
        description: "",
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".mov", ".avi", ".wmv"],
      "audio/*": [".mp3", ".wav", ".ogg", ".m4a"],
      "application/pdf": [".pdf"],
    },
    maxSize: 100 * 1024 * 1024,
    multiple: false,
    onDropRejected: (fileRejections) => {
      if (fileRejections && fileRejections.length > 0) {
        const reason = fileRejections[0].errors[0];
        if (reason && reason.code === "file-too-large") {
          setError("File size exceeds the 100MB limit.");
        } else {
          setError(reason && reason.message ? reason.message : "File not accepted.");
        }
      }
    },
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const icons = {
      image: "🖼️",
      video: "🎬",
      audio: "🎵",
      pdf: "📄",
    };
    return icons[fileType] || "📁";
  };

  const getFileType = (file) => {
    const name = file.name ? file.name.toLowerCase() : '';
    if (file.type.startsWith("image/") || [".png", ".jpg", ".jpeg", ".gif", ".webp"].some(ext => name.endsWith(ext))) return "image";
    if (file.type.startsWith("video/") || [".mp4", ".mov", ".avi", ".wmv"].some(ext => name.endsWith(ext))) return "video";
    if (file.type.startsWith("audio/") || [".mp3", ".wav", ".ogg", ".m4a"].some(ext => name.endsWith(ext))) return "audio";
    if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
    return "unknown";
  };

  const updateFileMetadata = (field, value) => {
    setFile((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (tag) => {
    if (tag.trim()) {
      setFile((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const removeTag = (tagIndex) => {
    setFile((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== tagIndex),
    }));
  };

  const uploadFile = async () => {
    if (!file) return;
    if (!user) {
      setError('User not authenticated');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fileType = getFileType(file.file);
      await uploadMediaFile(
        {
          file: file.file,
          description: file.description,
          tags: file.tags,
          fileType,
          userId: user.id,
          createdBy: user.email,
        },
        (progress) => {
          setUploadProgress(progress);
        }
      );
      setSuccess(true);
      setFile(null);
      setUploadProgress(0);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container p-8">
      <div className="main">

        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">⚠️</div>
            <p className="alert-text">{error}</p>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <div className="alert-icon">✅</div>
            <p className="alert-text">File uploaded successfully! Redirecting...</p>
          </div>
        )}

        <div className={file ? "upload-section" : "upload-section-single"}>
          <div
            {...getRootProps()}
            className={`dropzone-card ${isDragActive ? 'dropzone-active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <div className="dropzone-icon">
                {isDragActive ? "⬇️" : "📁"}
              </div>
              <h3 className="dropzone-title">
                {isDragActive ? "Drop file here" : "Drag & drop file here"}
              </h3>
              <p className="dropzone-text">Or click to select a file</p>
              <div className="format-tags">
                <span className="format-tag">Images</span>
                <span className="format-tag">Videos</span>
                <span className="format-tag">Audio</span>
                <span className="format-tag">PDFs</span>
              </div>
              <p className="dropzone-limit">Maximum file size: 100MB</p>
            </div>
          </div>

          {file && (
            <div className="file-section">
              <h3 className="file-section-title">Selected File</h3>
              
              <div className="file-preview-container">
                <div className="file-preview">
                  <FilePreview file={file.file} preview={file.preview} />
                </div>
                
                <div className="file-info">
                  <h4 className="file-name">{file.file.name}</h4>
                  <p className="file-size">{formatFileSize(file.file.size)}</p>
                  <span className="file-type">
                    {getFileType(file.file).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="metadata-section">
                <div className="metadata-field">
                  <label className="metadata-label">Description</label>
                  <textarea
                    value={file.description}
                    onChange={(e) =>
                      updateFileMetadata("description", e.target.value)
                    }
                    placeholder="Add a description..."
                    className="textarea"
                  />
                </div>

                <div className="metadata-field">
                  <label className="metadata-label">Tags</label>
                  <div className="tags-container">
                    <input
                      type="text"
                      placeholder="Add tags (press Enter)"
                      className="tag-input"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addTag(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <div className="tags-display">
                      {file.tags.map((tag, index) => (
                        <span key={index} className="tag-editable">
                          {tag}
                          <button
                            onClick={() => removeTag(index)}
                            className="tag-remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <div className="actions-section">
                <button
                  onClick={() => setFile(null)}
                  className={`btn btn-secondary ${uploading ? 'btn-disabled' : ''}`}
                  disabled={uploading}
                >
                  Clear File
                </button>
                
                <button
                  onClick={uploadFile}
                  className={`btn btn-primary ${uploading || !file ? 'btn-disabled' : ''}`}
                  disabled={uploading || !file}
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;