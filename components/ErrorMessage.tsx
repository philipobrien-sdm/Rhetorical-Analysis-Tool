import React from 'react';

interface ErrorMessageProps {
  message: string;
  t: (key: string) => string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, t }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-4 bg-red-900/30 border border-red-500 text-red-300 rounded-lg text-center">
      <p className="font-semibold">{t('errorOccurred')}</p>
      <p>{message}</p>
    </div>
  );
};