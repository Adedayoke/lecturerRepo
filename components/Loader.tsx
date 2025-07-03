import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader() {
  return (
    <span className="flex items-center justify-center w-full">
      <CircularProgress />
    </span>
  );
}
