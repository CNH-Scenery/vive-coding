import React, { ChangeEvent } from 'react';

interface UploadCardProps {
  label: string;
  imagePreview: string | null;
  onFileSelect: (file: File) => void;
  icon?: React.ReactNode;
}

const UploadCard: React.FC<UploadCardProps> = ({ label, imagePreview, onFileSelect, icon }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-square bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 hover:border-violet-500 transition-colors group overflow-hidden">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        aria-label={label}
      />
      
      {imagePreview ? (
        <img 
          src={imagePreview} 
          alt="Preview" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-violet-400 transition-colors p-4 text-center">
          {icon || (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs mt-1 text-slate-500">클릭하여 사진 업로드</span>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
