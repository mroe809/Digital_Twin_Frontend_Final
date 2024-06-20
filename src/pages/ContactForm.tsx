import { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { useState } from 'react';
import { createProcess, getAllCompanies } from '../slices/processSlice';
import {showNotification, NotificationType} from "../slices/notificationSlice";
import '../styles/common-styles.css'

const ContactForm = () => {
  const dispatch = useAppDispatch();

  const [processname, setprocessName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [materialId, setMaterial] = useState("");
  const [postProcessingId, setPostProcessing] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [materialDescription, setMaterialDescription] = useState("");
  const [postProcessingDescription, setPostProcessingDescription] = useState("");
  const [comment, setComment] = useState("");
  const { companies } = useAppSelector((state) => state.dTProcess);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  const handleCreateProcess = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    if (processname && companyId) {
    dispatch(
      createProcess({
        processname,
        companyId,
        materialId,
        postProcessingId,
        materialDescription,
        postProcessingDescription,
        comment,
        formData
      })
    );
    } else {
      dispatch(
        showNotification({
          message: "Please fill out all the required fields",
          type: NotificationType.Error,
        })
      );
    }
  };

  const inputStyle = {
    width: '50%' // oder eine andere gewünschte Breite
  };

  return (
    <form action="#" className="shift-right">
      <div className="form-group">
        <label htmlFor="subjectInput">Betreff</label>
        <input type="text" className="form-control" id="subjectInput" placeholder="Bitte einen Betreff eingeben" onChange={(e) => setprocessName(e.target.value)} style={inputStyle}/>
      </div>


      <div className="form-group mb-3">
        <label htmlFor="companySelect">Unternehmen auswählen</label>
        <select className="form-control" id="companySelect"  onChange={(e) => setCompanyId(e.target.value)} style={inputStyle}>
          <option value="" disabled selected>Bitte Unternehmen auswählen</option>
          {companies?.map((company) => (
              <option value={company.id}>{company.name}</option>
          ))}
        </select>
      </div>

      {/* <div className="form-group mb-3">
        <label htmlFor="manufacturingSelect">Fertigungsverfahren auswählen</label>
        <select className="form-control" id="manufacturingSelect" >
        <option value="" disabled selected>Bitte Fertigungsverfahren auswählen</option>
          <option>Fertigungsverfahren 1</option>
          <option>Fertigungsverfahren 2</option>
          <option>Fertigungsverfahren 3</option>
        </select>
      </div>
       */}

      <div className="form-group mb-3">
        <label htmlFor="materialSelect">Material auswählen</label>
        <select className="form-control" id="materialSelect"onChange={(e) => setMaterial(e.target.value)} style={inputStyle}>
        <option value="" disabled selected>Bitte Material auswählen</option>
          <option value="materialOne">Material 1</option>
          <option value="materialTwo">Material 2</option>
          <option value="materialThree">Material 3</option>
        </select>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="additionalInfoTextarea">Zusätzliche Informationen zum Material</label>
        <textarea 
        className="form-control" 
        id="additionalInfoTextarea" 
        onChange={(e) => setMaterialDescription(e.target.value)} style={inputStyle} 
        rows={4} 
        placeholder="Hier weitere Informationen zum Material eingeben">
        </textarea>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="postprocessingSelect">Nachbearbeitung auswählen</label>
        <select className="form-control" id="postprocessingSelect" onChange={(e) => setPostProcessing(e.target.value)} style={inputStyle}>
        <option value="" disabled selected>Bitte Nachbearbeitung auswählen</option>
          <option value="postProcessingOne">Nachbearbeitung 1</option>
          <option value="postProcessingTwo">Nachbearbeitung 2</option>
          <option value="postProcessingThree">Nachbearbeitung 3</option>
        </select>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="additionalInfoTextarea">Zusätzliche Informationen zur Nachbearbeitung</label>
        <textarea className="form-control" id="additionalInfoTextarea" onChange={(e) => setPostProcessingDescription(e.target.value)} style={inputStyle}
        rows={4} 
        placeholder="Hier weitere Informationen zur Nachbearbeitung eingeben"></textarea>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="fileUpload">Datei hochladen</label>
        <input type="file" onChange={handleFileChange} className="form-control" id="fileUpload" style={inputStyle}/>
        <small id="fileHelp" className="form-text text-muted">Bitte wählen Sie eine Datei aus, um hochzuladen.</small>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="additionalInfoTextarea">Anmerkungen</label>
        <textarea className="form-control" id="additionalInfoTextarea" onChange={(e) => setComment(e.target.value)} 
        rows={4} 
        placeholder="Hier ggf. weitere Anmerkungen eingeben (optional)"
        style={inputStyle}>
        </textarea>
      </div>
      
      <input type="Submit" value="Anfrage senden" className= "small-button" onClick={handleCreateProcess}/>
    </form>
  );
}

export default ContactForm;