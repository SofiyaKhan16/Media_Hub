
import { useState, useEffect, useCallback } from 'react';
import { getAllMediaFiles } from '../../api/mediaFile';
import { useNavigate } from 'react-router-dom';
import MediaFilters from '../../Components/MediaFilters';
import MediaCardsGrid from '../../Components/MediaCardsGrid';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [order, setOrder] = useState('desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalFetched, setTotalFetched] = useState(0);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchMoreData = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      const params = {
        page: currentPage + 1,
        limit: itemsPerPage,
      };
      
      if (selectedFileType !== 'all') params.fileType = selectedFileType;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sortBy = sortBy === 'recent' ? 'createdOn' : sortBy === 'popular' ? 'viewCount' : sortBy === 'name' ? 'fileName' : sortBy;
      if (order) params.order = order;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const newFiles = await getAllMediaFiles(params);
      
      if (newFiles.length > 0) {
        setMediaFiles(prevFiles => [...prevFiles, ...newFiles]);
        setCurrentPage(prevPage => prevPage + 1);
        setTotalFetched(prevTotal => prevTotal + newFiles.length);
        
        if (newFiles.length < itemsPerPage) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching more files:', err);
      setHasMore(false);
    }
  }, [currentPage, hasMore, loading, selectedFileType, searchTerm, sortBy, order, dateFrom, dateTo, itemsPerPage]);

  const [isFetchingMore] = useInfiniteScroll(fetchMoreData, hasMore);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    setTotalFetched(0);
    setMediaFiles([]);
  }, []);

  useEffect(() => {
    const fetchMediaFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: 1,
          limit: itemsPerPage,
        };
        
        if (selectedFileType !== 'all') params.fileType = selectedFileType;
        if (searchTerm) params.search = searchTerm;
        if (sortBy) params.sortBy = sortBy === 'recent' ? 'createdOn' : sortBy === 'popular' ? 'viewCount' : sortBy === 'name' ? 'fileName' : sortBy;
        if (order) params.order = order;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        
        const files = await getAllMediaFiles(params);
        setMediaFiles(files);
        setCurrentPage(1);
        setTotalFetched(files.length);
        
        if (files.length < itemsPerPage) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch media files');
        setLoading(false);
      }
    };

    resetPagination();
    fetchMediaFiles();
  }, [selectedFileType, searchTerm, sortBy, order, dateFrom, dateTo, itemsPerPage, resetPagination]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const icons = {
      image: '🖼️',
      video: '🎬',
      audio: '🎵',
      pdf: '📄'
    };
    return icons[fileType] || '📁';
  };

  const handleUpload = () => {
    navigate('/upload');
  };

  const handleEdit = (fileId) => {
    navigate(`/edit/${fileId}`);
  };

  const handleView = (fileId) => {
    navigate(`/view/${fileId}`);
  };

  const handleViewDetails = (fileId) => {
    navigate(`/details/${fileId}`);
  };

  if (error) {
    return (
      <div className="container">
        <div className="main">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Error</h3>
            <p className="error-desc">{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main">
        <div className="welcome-section">
          <h1 className="welcome-title">Discover Your Media Universe</h1>
          <p className="welcome-subtitle">Explore, Organize, and Share Your Multimedia Collection</p>
        </div>

        <MediaFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFileType={selectedFileType}
          setSelectedFileType={setSelectedFileType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          order={order}
          setOrder={setOrder}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          onUpload={handleUpload}
          userId={undefined}
        />

        <MediaCardsGrid
          files={mediaFiles}
          onEdit={handleEdit}
          onView={handleView}
          onViewDetails={handleViewDetails}
          formatFileSize={formatFileSize}
          loading={loading}
          isFetchingMore={isFetchingMore}
          hasMore={hasMore}
          onLoadMore={fetchMoreData}
          onClearFilters={() => {
            setSearchTerm('');
            setSelectedFileType('all');
          }}
        />
      </div>
    </div>
  );
}

export default Home;