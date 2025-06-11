import React from 'react';
import Image from 'next/image';

const ClaudeLoader = ({ size = 96, message = "Processing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        {/* Spinning Claude sona */}
        <div className="animate-spin" style={{ animationDuration: '2s' }}>
          <Image
            src="/claudesona.png"
            alt="Claude"
            width={size}
            height={size}
            priority
          />
        </div>
      </div>
      
      {message && (
        <div className="text-sm font-light text-gray-600 italic animate-pulse text-center max-w-md">
          {message.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaudeLoader;