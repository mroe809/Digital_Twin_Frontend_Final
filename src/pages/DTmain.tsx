import '../styles/dtmain.css'
import '../styles/common-styles.css'
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { setNextProcessStatus, setPreviousProcessStatus, getProcessById } from '../slices/processSlice';
import { useLocation, useParams, Link } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import BarometerGraph from '../images/BarometerGraph.png'
import TemperaturGraph from '../images/TemperaturGraph.png'
import { AccountType } from "../constants";


const DTmain: React.FC = () => {
    const dispatch = useAppDispatch();
    const { process, status, error } = useAppSelector((state) => state.dTProcess);
    //const processId = "6649e578b486fb0e93e4295b"; //for testing
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
    const accountType = basicUserInfo?.accountType;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    //const processId = queryParams.get('_id') ?? "6649e578b486fb0e93e4295b";
  
    const { _id } = useParams();
    const processId = _id ?? "6649e578b486fb0e93e4295b";
  
    // Funktion, um die Process-Daten zu laden
    useEffect(() => {
      if (basicUserInfo) {
        dispatch(getProcessById({
          processId
        }));
      }
    }, [dispatch]);

  
    // Funktion zum Aktualisieren des Status beim Klicken auf "Nächster Status"
    const nextStatus = async () => {
      dispatch(setNextProcessStatus({
        processId
      }));
    };
    
    // Funktion zum Zurücksetzen des Status beim Klicken auf "Status zurücksetzen"
    const previousStatus = async () => {
      dispatch(setPreviousProcessStatus({
        processId
      }));
    };

    const getBoxClass = (status: number) => {
      if (process && process.status) {
        return process.status >= status ? "sub-box-green" : "sub-box";
      }
      else{
        return "sub-box";
      }
    };

    if (status == "loading") return <p>Lade..</p>;
    if (error) return <p>Fehler: {error}</p>;
    if (status == "failed") return <p>Es ist ein unbekannter Fehler aufgetreten</p>;
    
    return(
      <div className="container-dt">
        <div className='boxtitle'>
          <h3>Digital Twin Übersicht: {process?.processname}</h3>
        </div>
        <div className="boxupperrow">
          <img src={BarometerGraph} alt="Bild 1" className="boxupperrow-img"  />
        </div>
        <div className="boxupperrow">
        <img src={TemperaturGraph} alt="Bild 1" className="boxupperrow-img"  />
        </div>
        <div className="box">
          <h2>Aktueller Status</h2>
          <div className="sub-boxes">
            <div className={getBoxClass(1)}>Vorbereitung</div>
            <div className={getBoxClass(2)}>Durchführung</div>
            <div className={getBoxClass(3)}>Nachbearbeitung</div>
            <div className={getBoxClass(4)}>Versand</div>
          </div>
          <div>
          {process && process.completedDate && (
            <div>
              <p>Prozess abgeschlossen am {format(process.completedDate, 'dd.MM.yyyy')} um {format(process.completedDate, 'hh:mm')} Uhr</p>
            </div>
          )}
          </div>
          <div className="button-container">
          {accountType === AccountType.Manufacturer && (
          <Link to = "/Upload">
                <button className="small-button">Datei hochladen</button>
                </Link>
          )}
            <Link to = "/Download">
              <button className="small-button">Dokumente</button>
            </Link>
            {accountType === AccountType.Manufacturer && (
            <>
            <button type='button' className="small-button" onClick={previousStatus}>Status zurücksetzen</button>
            <button type='button' className="small-button" onClick={nextStatus}>Nächster Status</button>
            </>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  export default DTmain;

