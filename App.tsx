import React, { useState, useCallback } from 'react';
import { generateBackground } from './services/geminiService';
import Header from './components/Header';
import ImageUploader, { UploadedImage } from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import PromptInput from './components/PromptInput';
import ModelConfig from './components/ModelConfig';

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(40);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleImagesAdd = (newFiles: File[]) => {
    const newUploaded: UploadedImage[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      url: URL.createObjectURL(file),
    }));
    setUploadedImages((prev) => [...prev, ...newUploaded]);
    setGeneratedImageUrls([]);
    setError(null);
  };

  const handleImageRemove = (id: string) => {
    setUploadedImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((img) => img.id !== id);
    });
    setGeneratedImageUrls([]);
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (uploadedImages.length === 0 || !prompt.trim()) {
      setError('لطفا حداقل یک تصویر انتخاب کرده و یک توصیف وارد کنید.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrls([]);

    try {
      const files = uploadedImages.map((img) => img.file);
      const newImageUrls = await generateBackground(prompt, files, { temperature, topK });
      setGeneratedImageUrls(newImageUrls);
    } catch (err) {
      console.error(err);
      setError('خطا در ایجاد تصویر. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImages, prompt, temperature, topK]);

  const handleDownloadAll = async () => {
    if (generatedImageUrls.length === 0) return;

    setIsZipping(true);
    setError(null);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const promises = generatedImageUrls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const extension = blob.type.split('/')[1] || 'png';
        zip.file(`generated-image-${index + 1}.${extension}`, blob);
      });

      await Promise.all(promises);

      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'generated-backgrounds.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Failed to create zip file', err);
      setError('خطا در ایجاد فایل فشرده.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 bg-gray-800/50 rounded-2xl shadow-2xl p-4 sm:p-8 backdrop-blur-sm border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Controls */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
              <ImageUploader
                uploadedImages={uploadedImages}
                onImagesAdd={handleImagesAdd}
                onImageRemove={handleImageRemove}
              />
              <PromptInput
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onPresetSelect={(presetText) => setPrompt(presetText)}
              />
              <ModelConfig
                temperature={temperature}
                onTemperatureChange={setTemperature}
                topK={topK}
                onTopKChange={setTopK}
              />
              <button
                id="generate-images-btn"
                onClick={handleSubmit}
                disabled={isLoading || uploadedImages.length === 0 || !prompt.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center text-lg cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>در حال ایجاد و ترکیب تصاویر...</span>
                  </>
                ) : (
                  'ترکیب تصاویر و ایجاد پس‌زمینه'
                )}
              </button>
              {error && <p className="text-red-400 text-center font-medium">{error}</p>}
            </div>

            {/* Right Column: Previews and Generated Outputs */}
            <div className="lg:col-span-2 flex flex-col space-y-8">
              {/* Top Section: Uploaded Reference Grid */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-xl font-bold text-gray-300 border-r-4 border-indigo-500 pr-3">
                  تصاویر ورودی شما ({uploadedImages.length})
                </h3>
                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    {uploadedImages.map((image, index) => (
                      <ImageDisplay
                        key={image.id}
                        title={`عکس ${index + 1}`}
                        imageUrl={image.url}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full p-10 text-center bg-gray-900/40 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500" style={{ minHeight: '150px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">هنوز تصویری آپلود نشده است. برای شروع، یک یا چند تصویر اضافه کنید.</p>
                  </div>
                )}
              </div>

              {/* Bottom Section: Generated Outputs */}
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl font-bold text-gray-300 border-r-4 border-indigo-500 pr-3">
                    پس‌زمینه‌های ساخته شده
                  </h3>
                  {generatedImageUrls.length > 0 && !isLoading && (
                    <button
                      id="download-all-btn"
                      onClick={handleDownloadAll}
                      disabled={isZipping}
                      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-wait text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 flex items-center text-sm cursor-pointer"
                    >
                      {isZipping ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>در حال آماده‌سازی...</span>
                        </>
                      ) : (
                        'دانلود همه (ZIP)'
                      )}
                    </button>
                  )}
                </div>

                {uploadedImages.length === 0 && (
                  <div className="w-full p-10 text-center bg-gray-900/70 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center" style={{ minHeight: '200px' }}>
                    <p className="text-gray-500 font-medium">نتایج در اینجا نمایش داده خواهند شد.</p>
                  </div>
                )}

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <ImageDisplay key={index} title="" imageUrl={null} isLoading={true} />
                        ))
                    ) : generatedImageUrls.length > 0 ? (
                      generatedImageUrls.map((url, index) => (
                        <ImageDisplay key={index} title="" imageUrl={url} showDownloadButton={true} />
                      ))
                    ) : (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <ImageDisplay key={index} title="" imageUrl={null} isLoading={false} />
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
