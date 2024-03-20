import React, { useState } from "react";

const FileUploadProgress = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded * 100) / event.total);
        setProgress(percentLoaded);
      }
    };

    reader.onloadend = () => {
      // Xử lý logic sau khi file được tải lên hoàn thành
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <div>Tiến trình: {progress}%</div>
    </div>
  );
};

export default FileUploadProgress;
