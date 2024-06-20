import React from 'react';
import '../styles/impressum.css';

const Impressum = () => {
  return (
    <div className="impressum-container">
      <h1>Impressum</h1>
      <p>
        <strong>Universität Rostock</strong><br />
        Universitätsplatz 1<br />
        18055 Rostock<br />
        Deutschland
      </p>
      <p>
        <strong>Telefon:</strong> +49 381 498-0<br />
        <strong>Fax:</strong> +49 381 498-1232<br />
        <strong>E-Mail:</strong> info@uni-rostock.de
      </p>
      <p>
        <strong>Rechtsform:</strong> Körperschaft des öffentlichen Rechts<br />
        <strong>Vertreten durch:</strong> Prof. Dr. Wolfgang Schareck (Rektor)
      </p>
      <p>
        <strong>Umsatzsteuer-Identifikationsnummer:</strong> DE 137/3000/0335
      </p>
      <p>
        <strong>Inhaltlich Verantwortlicher gemäß § 55 Abs. 2 RStV:</strong><br />
        Prof. Dr. Wolfgang Schareck<br />
        Universität Rostock<br />
        Universitätsplatz 1<br />
        18055 Rostock
      </p>
    </div>
  );
};

export default Impressum;
