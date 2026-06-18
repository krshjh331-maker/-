import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPresetSelect: (presetText: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onPresetSelect }) => {
  const presets = [
    {
      id: 'face-clothing',
      label: 'ترکیب چهره و لباس',
      text: 'چهره از عکس شماره ۱ و لباس از عکس شماره ۲',
    },
    {
      id: 'subject-bg',
      label: 'قرار دادن سوژه در پس‌زمینه دیگر',
      text: 'سوژه اصلی در عکس ۱ را جدا کن و آن را با نورپردازی طبیعی در پس‌زمینه عکس ۲ قرار بده.',
    },
    {
      id: 'creative-blend',
      label: 'ترکیب هنری دو تصویر',
      text: 'عناصر و سوژه‌های تصویر ۱ و ۲ را به صورت کاملاً خلاقانه و هنری با هم ترکیب کن تا یک تصویر واحد و هماهنگ ساخته شود.',
    },
  ];

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          ۲. توصیف صحنه یا نحوه ترکیب تصاویر
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={3}
          className="shadow-sm block w-full text-sm border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 p-3"
          placeholder="مثال: مبل موجود در «عکس ۱» را در پس‌زمینه ساحلی «عکس ۲» قرار بده و دور آن چند سنگ و صدف اضافه کن."
          value={value}
          onChange={onChange}
        />
      </div>

      {/* Preset prompt buttons */}
      <div>
        <span className="block text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          پیشنهادهای سریع (برای نوشتن خودکار کلیـک کنید):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              id={`preset-btn-${preset.id}`}
              onClick={() => onPresetSelect(preset.text)}
              className={`text-xs px-2.5 py-1.5 rounded-md border transition-all duration-200 text-right cursor-pointer ${
                value === preset.text
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-medium'
                  : 'bg-gray-800/60 border-gray-700 hover:border-gray-600 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed pt-1">
        💡 <strong>راهنما:</strong> با اشاره به <span className="text-indigo-400 font-bold">«عکس ۱»</span>، <span className="text-indigo-400 font-bold">«عکس ۲»</span> و... می‌توانید به هوش مصنوعی بگویید هر سوژه را در کجای تصویر نهایی قرار دهد.
      </p>
    </div>
  );
};

export default PromptInput;
