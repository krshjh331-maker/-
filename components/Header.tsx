
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 pb-2">
        تغییر پس‌زمینه با هوش مصنوعی
      </h1>
      <p className="mt-2 text-lg text-gray-400 max-w-3xl mx-auto">
        تصویر محصول خود را آپلود کنید، پس‌زمینه دلخواهتان را توصیف کنید و یک تصویر حرفه‌ای و طبیعی تحویل بگیرید.
      </p>
    </header>
  );
};

export default Header;
