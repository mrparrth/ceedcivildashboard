import { useState, useCallback, useEffect } from "react";
import { runScriptFunction } from "../../db/index";
import debounce from "lodash/debounce";

export const useQueueManager = (addNotification, handleGlobalError) => {
  const [requestQueue, setRequestQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToQueue = useCallback((functionName, data, options = {}) => {
    console.log("⏰ Adding to queue:", {
      functionName,
      currentQueueLength: requestQueue.length,
      isProcessing
    });

    const queueItem = {
      functionName,
      data,
      retryCount: 0,
      onSuccess: options.onSuccess,
      onError: options.onError,
      immediate: options.immediate || false
    };

    if (options.immediate) {
      setRequestQueue((prevQueue) => {
        console.log("📥 Setting immediate queue:", {
          prevLength: prevQueue.length,
          newLength: prevQueue.length + 1
        });
        return [queueItem, ...prevQueue];
      });
    } else {
      setRequestQueue((prevQueue) => {
        console.log("📥 Setting normal queue:", {
          prevLength: prevQueue.length,
          newLength: prevQueue.length + 1
        });
        return [...prevQueue, queueItem];
      });
    }
  }, []);

  const debouncedAddToQueue = useCallback(
    (functionName, data, options = {}) => {
      debounce((fn, d, opt) => addToQueue(fn, d, opt), 5000)(
        functionName,
        data,
        options
      );
    },
    [addToQueue]
  );

  const processQueue = useCallback(async () => {
    if (requestQueue.length === 0) return;
    if (isProcessing) {
      console.log("⏹️ Skipping process:", {
        isEmpty: requestQueue.length === 0,
        isProcessing
      });
      return;
    }

    setIsProcessing(true);

    const { functionName, data, retryCount, onSuccess, onError } =
      requestQueue[0];
    try {
      console.log("▶️ Starting process for:", requestQueue[0].functionName);
      const result = await runScriptFunction(functionName, data);
      console.log("✅ Process completed:", functionName);
      setRequestQueue((prevQueue) => prevQueue.slice(1));
      onSuccess?.(result);
    } catch (error) {
      if (error.type === "credentials") {
        setRequestQueue([]);
        handleGlobalError(error);
        onError?.(error);
        return;
      }

      if (retryCount >= 1) {
        setRequestQueue((prevQueue) => prevQueue.slice(1));
        addNotification({
          title: `${functionName} failed: ${error.message}`,
          type: "alert"
        });
        onError?.(error);
      } else {
        setRequestQueue((prevQueue) => [
          ...prevQueue.slice(1),
          { ...prevQueue[0], retryCount: retryCount + 1 }
        ]);
      }
    } finally {
      console.log("⏏️ Process finished, releasing lock");
      setIsProcessing(false);
    }
  }, [requestQueue, isProcessing, addNotification, handleGlobalError]);

  return { addToQueue, debouncedAddToQueue, processQueue, requestQueue };
};
