import React, { useEffect  } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { getProcessesbyCompanyId, getProcessesForCustomer } from "../slices/processSlice";
import { Link } from 'react-router-dom';
import '../styles/common-styles.css';
import '../styles/processes.css'
import { AccountType } from "../constants";
import ProzessBeispiel from '../images/Prozess_Beispiel.png'
import Tube from '../images/Tube.png'


const ProcessList = () => {
  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
  const dispatch = useAppDispatch();
  const { processes, process, status, error } = useAppSelector((state) => state.dTProcess);

  /*
   * if user is manufacturer, he gets every process for his assigned company, 
   * otherwhise we assume he is a customer and then he gets all of his created processes
   */
  useEffect(() => {
    if (basicUserInfo?.accountType == AccountType.Manufacturer) {
      dispatch(getProcessesbyCompanyId());
    }
    else{
      dispatch(getProcessesForCustomer());
    }
  }, [dispatch]);

  if (status == "loading") return <p>Lade..</p>;
  if (error) return <p>Fehler: {error}</p>;
  if (status == "failed") return <p>Es ist ein unbekannter Fehler aufgetreten</p>;
  
const processImages = [ProzessBeispiel, Tube];




  return (
    <>
        <div className="d-flex justify-content-center align-items-start vh-100">
        <div className="container">
        <div style={{ height: '20px' }}></div>
      <h1>Übersicht Digital Twins</h1>
      <div style={{ height: '20px' }}></div>
      {processes?.map((process, index) => (
        <div key={process.processname} className="process-item">
          <h4>{process.processname} von Kunde 1 </h4>
          {index < 3 && (
    <img src={processImages[index]} className="process-image" />
  )}
          <Link to={`/dtmain/${process._id}`} className="link-style">
            <p className="link">Weitere Informationen</p>
          </Link>
        </div>
        
      ))}
    </div>
    </div>

    </>
  );
};

export default ProcessList;