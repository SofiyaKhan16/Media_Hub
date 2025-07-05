import React from 'react';
import FilePreview from './FilePreview';

function MediaCardsGrid({ files, onEdit, onView, onViewDetails, loading, onClearFilters, isFetchingMore, hasMore, onLoadMore }) {
  const defaultProfilePicture = null;
  const defaultUsername = 'Unknown User';
  const defaultFileType = 'UNKNOWN';
  const defaultViewCount = 0;
  const defaultCreatedOn = 'Unknown Date';
  const defaultFileName = 'Unnamed File';
  const defaultDescription = 'No description available';

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-icon">⏳</div>
        <h3 className="loading-title">Loading...</h3>
        <p className="loading-desc">Fetching your media files</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3 className="empty-title">No files found</h3>
        <p className="empty-desc">Try adjusting your search terms or filters</p>
        {onClearFilters && (
          <button className="btn btn-primary" onClick={onClearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="media-grid">
      {files.map((file) => {
        const profilePicture = file.userId?.profilePicture || defaultProfilePicture;
        const username = file.userId?.username || file.createdBy || defaultUsername;
        const fileType = file.fileType || defaultFileType;
        const viewCount = file.viewCount ?? defaultViewCount;
        const createdOn = file.createdOn
          ? new Date(file.createdOn).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : defaultCreatedOn;
        const fileName = file.fileName || defaultFileName;
        const description = file.description || defaultDescription;
        const previewUrl = file.cloudinaryUrl || '';

        const profileInitial = username.charAt(0).toUpperCase() || 'A';

        return (
          <div
            key={file._id}
            className="media-card"
            onClick={() => onViewDetails && onViewDetails(file._id)}
            onMouseEnter={(e) => {
              const cover = e.currentTarget.querySelector('.card-cover');
              if (cover) cover.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const cover = e.currentTarget.querySelector('.card-cover');
              if (cover) cover.style.opacity = '0';
            }}
          >
            <div className="card-cover"></div>
            <div className="card-preview">
              <FilePreview
                file={{
                  type: fileType === 'pdf' ? 'application/pdf' : `${fileType}/*`,
                }}
                preview={previewUrl}
              />
              <div className="card-type">{fileType.toUpperCase()}</div>
            </div>
            <div className="card-info">
              <h3 className="card-title">{fileName}</h3>
              <p className="card-desc">{description}</p>
              <div className="user-info-card">
                {profilePicture ? (
                  <img src={profilePicture} alt={username} className="profile-picture-sm" />
                ) : (
                  <div className="profile-picture-sm">{profileInitial}</div>
                )}
                <span className="username">{username}</span>
              </div>
              <div className="card-stats">
                <div className="card-stats-left">
                  <span>Popularity: {viewCount} views</span>
                </div>
              </div>
              <div className="card-date">Created: {createdOn}</div>
            </div>
          </div>
        );
      })}
      
      {isFetchingMore && (
        <div className="loading-more">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading more files...</p>
        </div>
      )}
      
      {!isFetchingMore && hasMore && onLoadMore && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={onLoadMore}>
            Load More Files
          </button>
        </div>
      )}
      
      {!hasMore && !loading && files.length > 0 && (
        <div className="end-of-results">
          <div className="end-icon">🏁</div>
          <p>You've reached the end!</p>
          <span>No more files to load</span>
        </div>
      )}
    </div>
  );
}

export default MediaCardsGrid;