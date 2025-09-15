import React, { useState } from 'react';
import { Upload as UploadIcon, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cityName, setCityName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!file || !cityName.trim()) {
      alert('Please provide both an image and a city name');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('cityName', cityName.trim());

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      navigate('/report', { 
        state: { 
          reportData: data,
          imageUrl: previewUrl,
          cityName: cityName.trim()
        } 
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Satellite Image</h1>
          <p className="text-gray-600">Supported formats: JPEG, PNG, or TIFF</p>
        </div>

        <div className="space-y-6">
          {/* City Input */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City Name
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                id="cityName"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Enter city name"
                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-2"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              {previewUrl ? (
                <div className="mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 rounded-lg"
                  />
                </div>
              ) : (
                <UploadIcon className={`h-12 w-12 mb-4 ${isDragging ? 'text-orange-500' : 'text-gray-400'}`} />
              )}
              <p className="text-xl font-medium text-gray-900 mb-2">
                {file ? file.name : 'Drag and drop your image here'}
              </p>
              <p className="text-gray-500 mb-4">or</p>
              <label className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.tiff"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          </div>

          {file && cityName && (
            <div className="mt-8 text-center">
              <button
                className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSubmit}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Submit Image'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}