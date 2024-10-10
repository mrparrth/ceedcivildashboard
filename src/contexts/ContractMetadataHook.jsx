import { useState, useEffect, useRef } from "react";
import { runScriptFunction } from "../db/index";

let cachedContractMetadata = null;

export const useContractMetadata = () => {
  const [contractMetadata, setContractMetadata] = useState(
    cachedContractMetadata
  );
  const [isLoading, setIsLoading] = useState(!cachedContractMetadata);
  const [error, setError] = useState(null);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    const fetchContractMetadata = async () => {
      if (initialFetchDone.current) return;

      if (!cachedContractMetadata) {
        setIsLoading(true);
        try {
          const data = await runScriptFunction("getContractMetadata");
          setContractMetadata(data);
          cachedContractMetadata = data;
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching contract metadata:", err);
          setError(err);
          setIsLoading(false);
        }
      }

      initialFetchDone.current = true;
    };

    fetchContractMetadata();
  }, []);

  // console.log("useContractMetadata hook state:", {
  //   isLoading,
  //   contractMetadata,
  //   error,
  // });

  return { contractMetadata, isLoading, error };
};
