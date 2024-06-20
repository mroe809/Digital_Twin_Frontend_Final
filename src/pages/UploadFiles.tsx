import React, { useState, ChangeEvent } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAppSelector } from "../hooks/redux-hooks";
import '../styles/common-styles.css';
import '../styles/uploadfiles.css'

const UploadPage = () => {
  const processId = useAppSelector((state) => state.dTProcess.process?._id);
  const processname = useAppSelector((state) => state.dTProcess.process?.processname ?? "Nicht gefunden");

  const [selectedFolder, setSelectedFolder] = useState('');

  const handleFolderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
  };

  const handleFileUpload = async (file: File) => {
    if (!processId) {
      console.error('Prozess-ID ist nicht definiert.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('processId', String(processId));
      formData.append('folderName', selectedFolder);
      formData.append('file', file);

      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload erfolgreich:', response.data);
    } catch (error) {
      console.error('Fehler beim Upload:', error);
    }
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="shift-right">
      <h2>Dateiupload Digital Twin: {processname}</h2>
      <div className="content">
        <label>Prozessschritt auswählen:</label>
        <select value={selectedFolder} onChange={handleFolderChange} >
          <option value="Vorbereitung">Vorbereitung</option>
          <option value="3D-Druck">3D-Druck</option>
          <option value="Nachbearbeitung">Nachbearbeitung</option>
          <option value="Versand">Versand</option>
        </select>
      </div>
      <div className="content">
        <label >Datei auswählen:</label>
        <input id="fileInput" type="file" />
      </div>
      <button className="small-button" onClick={handleUploadButtonClick}>Datei hochladen</button>
    </div>
  );
};

export default UploadPage;
