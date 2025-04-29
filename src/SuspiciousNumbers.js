import React, { useState } from 'react';
import axios from 'axios';
import './SuspiciousNumbers.css';
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
      <defs>
        <path id="marker" d="M15,0 C10,0 5,5 5,10 C5,15 15,30 15,30 C15,30 25,15 25,10 C25,5 20,0 15,0" />
      </defs>
      <g fill="#E50914">
        <use href="#marker" />
      </g>
    </svg>
  `),
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

const SuspiciousNumbers = () => {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [locations, setLocations] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a valid CSV file.');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please choose a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/upload_csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, // Add this to allow sending cookies (if needed)
      });

      if (response.data && response.data.suspicious_numbers?.length) {
        setNumbers(response.data.suspicious_numbers);
        setLocations(response.data.suspicious_numbers.flatMap(num => num.locations || []));
      } else {
        setError('No suspicious numbers found.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload or process the file. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    { label: "Suspicious Number", key: "number" },
    { label: "Reason", key: "reason" },
  ];

  const csvData = numbers.map(num => ({
    number: num.mobile_number,
    reason: num.reason,
  }));

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Suspicious Mobile Numbers", 10, 10);
    doc.setFontSize(12);
    numbers.forEach((num, index) => {
      doc.text(`${index + 1}. ${num.mobile_number} - ${num.reason}`, 10, 20 + (index * 10));
    });
    doc.save("suspicious_numbers.pdf");
  };

  return (
    <div className="main-container">
      <div className="section">
        <h1 className="title">SecureTrack</h1>
        <h2 className="subtitle">Upload CSV File</h2>

        <div className="upload-section">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input"
            aria-label="Upload CSV File"
          />
          <button
            className="upload-button"
            onClick={handleFileUpload}
            aria-label="Upload CSV"
          >
            Upload
          </button>
        </div>

        {loading && <p className="loading">Processing...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {numbers.length > 0 && (
        <div className="section">
          <table className="numbers-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Suspicious Number</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {numbers.map((num, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{num.mobile_number}</td>
                  <td>{num.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="download-buttons">
            <CSVLink data={csvData} headers={headers} filename={"suspicious_numbers.csv"} className="csv-button">
              Download CSV
            </CSVLink>
            <button className="pdf-button" onClick={generatePDF}>
              Download PDF
            </button>
          </div>
        </div>
      )}

      {locations.length > 0 && (
        <div className="section">
          <h2 className="subtitle">Geographical Map</h2>
          <MapContainer 
            center={[locations[0]?.latitude || 51.505, locations[0]?.longitude || -0.09]} 
            zoom={5} 
            style={{ height: "400px", width: "80%" }}
            className="map-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {locations.map((loc, index) => (
              <Marker 
                key={index} 
                position={[loc.latitude, loc.longitude]} 
                icon={redIcon}
              >
                <Popup>
                  <strong>Location:</strong> {loc.location}<br />
                  <strong>Number:</strong> {loc.mobile_number}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default SuspiciousNumbers;
