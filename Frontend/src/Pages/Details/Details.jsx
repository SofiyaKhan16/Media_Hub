import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMediaFileById, deleteMediaFile } from '../../api/mediaFile';
import FilePreview from '../../Components/FilePreview';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchMediaFile = async () => {
      try {
        setLoading(true);
        const file = await getMediaFileById(id);
        setMediaFile(file);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch media file details');
        setLoading(false);
      }
    };

    if (id) {
      fetchMediaFile();
    }
  }, [id]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showDeleteModal) {
        handleCancelDelete();
      }
    };

    if (showDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDeleteModal]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteMediaFile(id);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to delete media file');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="main">
          <div className="loading-state">
            <div className="loading-icon">⏳</div>
            <h3 className="loading-title">Loading...</h3>
            <p className="loading-desc">Fetching media file details</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="main">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Error</h3>
            <p className="error-desc">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mediaFile) {
    return (
      <div className="container">
        <div className="main">
          <div className="error-state">
            <div className="error-icon">🔍</div>
            <h3 className="error-title">Media File Not Found</h3>
            <p className="error-desc">The requested media file could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const profilePicture = mediaFile.userId?.profilePicture || null;
  const username = mediaFile.userId?.username || mediaFile.createdBy || 'Unknown User';
  const userEmail = mediaFile.userId?.email || 'No email available';
  const profileInitial = username.charAt(0).toUpperCase() || 'A';

  const canDelete = user && mediaFile && user.email === mediaFile.createdBy;

  return (
    <div className="container">
      <div className="main">
        <div className="content">
          <div className="media-section">
            <div className="media-preview">
              <FilePreview
                file={{
                  type: mediaFile.fileType === 'pdf' ? 'application/pdf' : `${mediaFile.fileType}/*`,
                }}
                preview={mediaFile.cloudinaryUrl}
              />
              <div className="media-type">{mediaFile.fileType.toUpperCase()}</div>
            </div>
            <div className="media-info">
              <h1 className="title">{mediaFile.fileName}</h1>
              {mediaFile.description && (
                <p className="description">{mediaFile.description}</p>
              )}
              {mediaFile.tags && mediaFile.tags.length > 0 && (
                <div className="tags">
                  {mediaFile.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="details-section">
            <div className="details-header">
              <h2 className="details-title">File Details</h2>
              {canDelete && (
                <button
                  className={`edit-button ${deleting ? 'edit-button-disabled' : ''}`}
                  onClick={handleDeleteClick}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
            
            <div className="detail-item">
              <span className="detail-label">File Type</span>
              <span className="detail-value">{mediaFile.fileType.toUpperCase()}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">File Size</span>
              <span className="detail-value">{formatFileSize(mediaFile.fileSize)}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Views</span>
              <span className="detail-value">{mediaFile.viewCount || 0}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">
                {mediaFile.createdOn ? formatDate(mediaFile.createdOn) : 'Unknown'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Modified</span>
              <span className="detail-value">
                {mediaFile.modifiedOn ? formatDate(mediaFile.modifiedOn) : 'Never'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Created By</span>
              <span className="detail-value">{mediaFile.createdBy || 'Unknown'}</span>
            </div>
            
            {mediaFile.modifiedBy && (
              <div className="detail-item">
                <span className="detail-label">Modified By</span>
                <span className="detail-value">{mediaFile.modifiedBy}</span>
              </div>
            )}

            <div className="user-info-details">
              {profilePicture ? (
                <img src={profilePicture} alt={username} className="profile-picture" />
              ) : (
                <div className="profile-picture">{profileInitial}</div>
              )}
              <div className="user-details">
                <span className="username">{username}</span>
                <span className="user-email">{userEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">🗑️</span>
              <h3 className="modal-title">Delete Media File</h3>
            </div>
            <p className="modal-message">
              Are you sure you want to delete "<strong>{mediaFile.fileName}</strong>"? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="modal-button modal-button-cancel"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={`modal-button modal-button-delete ${deleting ? 'modal-button-disabled' : ''}`}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;
