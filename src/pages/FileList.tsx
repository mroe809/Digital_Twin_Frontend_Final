import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import axiosInstance from '../api/axiosInstance';
import { downloadFile, fetchFiles } from '../slices/processSlice';
import '../styles/common-styles.css';

const FileList: React.FC = () => {
  const dispatch = useAppDispatch();
  const processId = useAppSelector((state) => state.dTProcess.process?._id);
  const twinname = useAppSelector((state) => state.dTProcess.process?.processname);
  const files = useAppSelector((state) => state.dTProcess.files);

  useEffect(() => {
    if (processId) {
      dispatch(fetchFiles(processId));
    }
  }, [dispatch, processId]);

  const handleDownload = (folder: string, fileName: string) => {
    if (processId) {
      dispatch(downloadFile({ processId, folder, fileName }));
    } else {
      console.error('Process ID is not defined');
    }
  };

  const folderNames = ["Vorbereitung", "3D-Druck", "Nachbearbeitung", "Versand"];

  return (
    <div className="shift-right">
      <h2>Dateiliste für den Digital Twin "{twinname}"</h2>
      {folderNames.map((folder) => (
        <div key={folder}>
          <h3>{folder}</h3>
          <ul>
            {files[folder] && files[folder].length > 0 ? (
              files[folder].map((file, index) => (
                <li key={index} className="link-style" onClick={() => handleDownload(folder, file)}>
                  {file}
                </li>
              ))
            ) : (
              <li>Keine Dateien</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default FileList;
