import { useState, useCallback } from "react";
import { runScriptFunction } from "../../db/index";
import debounce from "lodash/debounce";

export const useQueueManager = (addNotification) => {
  const [requestQueue, setRequestQueue] = useState([]);

  const addToQueue = useCallback((functionName, data) => {
    setRequestQueue((prevQueue) => [
      ...prevQueue,
      { functionName, data, retryCount: 0 },
    ]);
  }, []);

  const debouncedAddToQueue = debounce(addToQueue, 5000);

  const processQueue = useCallback(async () => {
    if (requestQueue.length === 0) return;

    const { functionName, data, retryCount } = requestQueue[0];
    try {
      await runScriptFunction(functionName, data);
      setRequestQueue((prevQueue) => prevQueue.slice(1));
      addNotification({ title: `${functionName} completed successfully` });
    } catch (error) {
      console.error(`Error processing ${functionName}:`, error);
      if (retryCount >= 1) {
        //prodchg to 4
        setRequestQueue((prevQueue) => prevQueue.slice(1));
        addNotification({
          title: `${functionName} failed after multiple attempts`,
          type: "alert",
        });
      } else {
        setRequestQueue((prevQueue) => [
          ...prevQueue.slice(1),
          { ...prevQueue[0], retryCount: retryCount + 1 },
        ]);
      }
    }
  }, [requestQueue, addNotification]);

  return { addToQueue, debouncedAddToQueue, processQueue, requestQueue };
};
