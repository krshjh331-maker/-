import React, { useRef, useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
}

interface ImageUploaderProps {
  uploadedImages: UploadedImage[];
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (id: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  uploadedImages,
  onImagesAdd,
  onImageRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (FileList: FileList | null) => {
    if (!FileList) return;
    const filesArray = Array.from(FileList);
    // Filter to only accept images
    const imageFiles = filesArray.filter((file) =>
      file.type.match(/image\/(png|jpeg|jpg|webp)/)
    );
    if (imageFiles.length > 0) {
      onImagesAdd(imageFiles);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    // Reset file input value to allow uploading the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ۱. تصاویر خود را آپلود کنید (یک یا چند تصویر)
        </label>
        <div
          id="uploader-drop-container"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-gray-600 hover:border-indigo-400 bg-gray-900/40 hover:bg-gray-900/60'
          }`}
        >
          <div className="space-y-2 text-center pointer-events-none">
            <Upload className={`mx-auto h-12 w-12 transition-colors ${isDragging ? 'text-indigo-400' : 'text-gray-400'}`} />
            <div className="flex flex-col text-sm text-gray-300">
              <p className="font-medium">برای آپلود کلیک کنید یا فایل‌ها را به اینجا بکشید</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (حداکثر ۵ مگابایت)</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            id="file-upload"
            name="file-upload"
            type="file"
            multiple
            className="sr-only"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            تصاویر اضافه شده ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {uploadedImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700 bg-gray-950 shadow-md transition-all hover:scale-[1.02] hover:border-indigo-500"
              >
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Number Indicator badge */}
                <div className="absolute top-1 right-1 bg-indigo-600/90 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                  عکس {index + 1}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  id={`remove-image-btn-${image.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageRemove(image.id);
                  }}
                  className="absolute bottom-1 left-1 bg-red-600/90 text-white p-1 rounded-full hover:bg-red-700 transition-colors shadow shadow-black/50"
                  title="حذف این تصویر"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
