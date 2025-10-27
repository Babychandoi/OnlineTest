import React from 'react';
import { X, Save } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  showSaveButton?: boolean;
  saveDisabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSave, 
  showSaveButton = true, 
  saveDisabled = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {showSaveButton && onSave && (
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-2xl border-t">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={onSave}
              disabled={saveDisabled}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
