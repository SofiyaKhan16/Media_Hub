import React from 'react';

function MediaFilters({
  searchTerm,
  setSearchTerm,
  selectedFileType,
  setSelectedFileType,
  sortBy,
  setSortBy,
  order,
  setOrder,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onUpload,
  userId
}) {
  return (
    <div className="filters-card">
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search files by name, tags, or description..."
          className="input-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filters-row">
        <div className="filters-left">
          <select
            className="filter-select"
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDFs</option>
          </select>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="name">Name A-Z</option>
          </select>
          <select
            className="filter-select"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <input
            type="date"
            className="filter-select"
            placeholder="Date From"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
          <input
            type="date"
            className="filter-select"
            placeholder="Date To"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </div>
        {onUpload && (
          <button className="btn-upload" onClick={onUpload}>
            Upload New
          </button>
        )}
      </div>
    </div>
  );
}

export default MediaFilters;
