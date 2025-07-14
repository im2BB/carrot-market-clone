"use client";

import { useState } from "react";

interface DeleteConfirmModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteConfirmModal({
  title,
  description,
  onConfirm,
  children,
}: DeleteConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
            <p className="text-neutral-400 mb-6">{description}</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
