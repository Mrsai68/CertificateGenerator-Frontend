import React, { useEffect, useState, useRef } from 'react';
import { Camera, X, QrCode, AlertCircle, ArrowRight, Upload, Image } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrScannerModal({ onClose, onScanSuccess }) {
  const [manualInput, setManualInput] = useState('');
  const [scanError, setScanError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const processDecodedText = (decodedText) => {
    let tokenStr = decodedText.trim();
    if (tokenStr.includes('/verify/')) {
      tokenStr = tokenStr.split('/verify/')[1];
    }
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
    onScanSuccess(tokenStr);
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader-viewport");
    scannerRef.current = html5QrCode;

    const config = { fps: 10, qrbox: { width: 220, height: 220 } };

    // Try camera enumeration first for maximum device compatibility
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length > 0) {
        // Prefer back camera if available, otherwise pick the first camera
        const backCam = devices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('environment') || 
          d.label.toLowerCase().includes('rear')
        );
        const selectedCamId = backCam ? backCam.id : devices[0].id;

        html5QrCode.start(
          selectedCamId,
          config,
          (decodedText) => processDecodedText(decodedText),
          () => {} // Frame error callback
        ).then(() => {
          setIsScanning(true);
        }).catch((err) => {
          console.warn("Camera start with device ID error, trying facingMode:", err);
          fallbackStartFacingMode(html5QrCode, config);
        });
      } else {
        fallbackStartFacingMode(html5QrCode, config);
      }
    }).catch((err) => {
      console.warn("getCameras error, falling back to facingMode:", err);
      fallbackStartFacingMode(html5QrCode, config);
    });

    const fallbackStartFacingMode = (scanner, cfg) => {
      scanner.start(
        { facingMode: "user" },
        cfg,
        (decodedText) => processDecodedText(decodedText),
        () => {}
      ).then(() => {
        setIsScanning(true);
      }).catch((err) => {
        console.warn("Camera access denied or unavailable:", err.message);
        setScanError("Camera access denied or unavailable. Please upload a QR code image or use manual input.");
      });
    };

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop().catch(() => {});
      }
      const html5QrCode = scannerRef.current || new Html5Qrcode("qr-reader-viewport");
      const decodedText = await html5QrCode.scanFile(file, true);
      processDecodedText(decodedText);
    } catch (err) {
      setScanError("Unable to decode QR code from the selected image. Please try another image.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      processDecodedText(manualInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">QR Code Scanner</h3>
              <p className="text-xs text-slate-500 font-semibold">Live Camera & Image Upload Scanner</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
              }
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-blue-500/50 shadow-inner flex flex-col items-center justify-center min-h-[240px]">
          <div id="qr-reader-viewport" className="w-full h-full" />

          {scanError && (
            <div className="p-4 text-center space-y-2 bg-slate-900 text-rose-300 text-xs font-semibold w-full">
              <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
              <span>{scanError}</span>
            </div>
          )}
        </div>

        {/* Image File Upload Button */}
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-xs"
          >
            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Upload QR Image File</span>
          </button>
        </div>

        {/* Manual Token Input */}
        <form onSubmit={handleManualSubmit} className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Or Enter Certificate Ref / Token
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              required
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. CERT-123456 or token..."
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1 shrink-0"
            >
              <span>Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
