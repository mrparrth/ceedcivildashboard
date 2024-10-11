import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const SafeImageBox = ({ src, alt, sx, ...props }) => {
  const [safeSrc, setSafeSrc] = useState("");

  useEffect(() => {
    setSafeSrc("https:/" + src);
  }, [src]);

  return <Box component="img" src={safeSrc} alt={alt} sx={sx} {...props} />;
};

export default SafeImageBox;
