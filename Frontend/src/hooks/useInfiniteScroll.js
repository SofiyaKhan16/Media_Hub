import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (fetchMore, hasMore) => {
  const [isFetching, setIsFetching] = useState(false);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (fetchingRef.current || !hasMore) return;
      
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 200;
      
      if (scrolledToBottom) {
        setIsFetching(true);
      }
    };

    let timeoutId;
    const throttledHandleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasMore]);

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreData();
  }, [isFetching]);

  const fetchMoreData = useCallback(async () => {
    if (hasMore && !fetchingRef.current) {
      fetchingRef.current = true;
      try {
        await fetchMore();
      } catch (error) {
        console.error('Error fetching more data:', error);
      }
      fetchingRef.current = false;
    }
    setIsFetching(false);
  }, [fetchMore, hasMore]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
