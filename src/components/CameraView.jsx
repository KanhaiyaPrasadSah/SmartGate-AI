import React, { useRef } from "react";
import Webcam from "react-webcam";
import "./CameraView.css";

const CameraView = ({
  cameraSource,
  ipUrl,
  faceBoxes,
  webcamRef,
  ipImgRef
}) => {
  return (
    <div className="camera-wrap">

      {/* CAMERA SOURCE */}
      {cameraSource === "webcam" ? (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          mirrored
          className="webcam"
        />
      ) : (
        <img
          ref={ipImgRef}
          src={ipUrl}
          alt="ESP32 Stream"
          crossOrigin="anonymous"
          className="webcam"
        />
      )}

      {/* FACE BOUNDING BOXES */}
      {faceBoxes.map((face, i) => {
        if (!face?.box) return null;

        const [x1, y1, x2, y2] = face.box;

        // Convert to % (responsive overlay)
        const left = (x1 / 640) * 100;
        const top = (y1 / 480) * 100;
        const width = ((x2 - x1) / 640) * 100;
        const height = ((y2 - y1) / 480) * 100;

        return (
          <div
            key={i}
            className={`face-box ${face.identified ? "known" : "unknown"}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`
            }}
          >
            <span className="face-label">
              {face.identified
                ? face.student?.NAME
                : "Unknown"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CameraView;