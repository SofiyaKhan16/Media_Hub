import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllMediaFiles } from '../../api/mediaFile';
import MediaFilters from '../../Components/MediaFilters';
import MediaCardsGrid from '../../Components/MediaCardsGrid';
import { useNavigate } from 'react-router-dom';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function Profile() {
  const { id } = useParams();
  const currentUser = useSelector(state => state.user.user);
  const navigate = useNavigate();
  
  const isOwnProfile = !id || id === currentUser?.id;
  const profileUserId = isOwnProfile ? currentUser?.id : id;
  
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
  const itemsPerPage = 12;
  const [kpiData, setKpiData] = useState({
    total: 0,
    images: 0,
    videos: 0,
    audios: 0,
    pdfs: 0,
    totalSize: 0,
    avgViewCount: 0
  });

  const fetchMoreData = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      const params = {
        userId: profileUserId,
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
  }, [currentPage, hasMore, loading, profileUserId, selectedFileType, searchTerm, sortBy, order, dateFrom, dateTo, itemsPerPage]);

  const [isFetchingMore] = useInfiniteScroll(fetchMoreData, hasMore);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    setTotalFetched(0);
    setMediaFiles([]);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          userId: profileUserId,
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
        
        const allFilesParams = { userId: profileUserId };
        const allFiles = await getAllMediaFiles(allFilesParams);
        
        const kpis = allFiles.reduce((acc, file) => {
          acc.total += 1;
          acc.totalSize += file.fileSize || 0;
          acc.avgViewCount += file.viewCount || 0;
          
          switch (file.fileType) {
            case 'image':
              acc.images += 1;
              break;
            case 'video':
              acc.videos += 1;
              break;
            case 'audio':
              acc.audios += 1;
              break;
            case 'pdf':
              acc.pdfs += 1;
              break;
            default:
              break;
          }
          
          return acc;
        }, {
          total: 0,
          images: 0,
          videos: 0,
          audios: 0,
          pdfs: 0,
          totalSize: 0,
          avgViewCount: 0
        });
        
        kpis.avgViewCount = kpis.total > 0 ? Math.round(kpis.avgViewCount / kpis.total) : 0;
        
        setKpiData(kpis);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch profile data');
        setLoading(false);
      }
    };

    if (profileUserId) {
      resetPagination();
      fetchProfileData();
    }
  }, [profileUserId, selectedFileType, searchTerm, sortBy, order, dateFrom, dateTo, itemsPerPage, resetPagination]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const kpiCards = [
    { icon: '📊', label: 'Total Files', value: kpiData.total },
    { icon: '🖼️', label: 'Images', value: kpiData.images },
    { icon: '💾', label: 'Total Size', value: formatFileSize(kpiData.totalSize) },
    { icon: '👁️', label: 'Avg Views', value: kpiData.avgViewCount }
  ];

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
        {/* KPI Cards Row */}
        <div className="kpi-cards-row">
          {kpiCards.map((kpi, idx) => (
            <div key={idx} className="kpi-card">
              <div className="kpi-emoji-text">
                {kpi.icon} {kpi.label}
              </div>
              <div className="kpi-value">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Media Filters */}
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
          onUpload={isOwnProfile ? handleUpload : undefined}
          userId={profileUserId}
        />

        {/* Media Cards Grid */}
        <MediaCardsGrid
          files={mediaFiles}
          onEdit={isOwnProfile ? handleEdit : undefined}
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

export default Profile;