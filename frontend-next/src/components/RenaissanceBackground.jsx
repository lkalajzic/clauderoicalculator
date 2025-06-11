import React from 'react';

const RenaissanceBackground = ({ opacity = 0.05 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {/* Blueprint-style grid */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <pattern
          id="blueprint-grid-renaissance"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="#dc7454"
            strokeWidth="0.5"
          />
          <path
            d="M 25 0 L 25 50 M 0 25 L 50 25"
            fill="none"
            stroke="#dc7454"
            strokeWidth="0.2"
            opacity="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#blueprint-grid-renaissance)" />
      </svg>

      {/* Modern neural network overlay - contained */}
      <svg
        className="absolute bottom-0 right-0 w-1/2 h-1/2 max-w-[400px] max-h-[400px]"
        viewBox="0 0 400 400"
      >
        <g opacity="0.5">
          {/* Input layer */}
          <circle cx="50" cy="100" r="3" fill="#dc7454" opacity="0.3" />
          <circle cx="50" cy="150" r="3" fill="#dc7454" opacity="0.3" />
          <circle cx="50" cy="200" r="3" fill="#dc7454" opacity="0.3" />
          <circle cx="50" cy="250" r="3" fill="#dc7454" opacity="0.3" />

          {/* Hidden layer 1 */}
          <circle cx="150" cy="80" r="4" fill="#1a1a1a" />
          <circle cx="150" cy="130" r="4" fill="#1a1a1a" />
          <circle cx="150" cy="180" r="4" fill="#1a1a1a" />
          <circle cx="150" cy="230" r="4" fill="#1a1a1a" />
          <circle cx="150" cy="280" r="4" fill="#1a1a1a" />

          {/* Hidden layer 2 */}
          <circle cx="250" cy="100" r="4" fill="#1a1a1a" />
          <circle cx="250" cy="175" r="4" fill="#1a1a1a" />
          <circle cx="250" cy="250" r="4" fill="#1a1a1a" />

          {/* Output layer */}
          <circle cx="350" cy="150" r="3" fill="#dc7454" opacity="0.3" />
          <circle cx="350" cy="200" r="3" fill="#dc7454" opacity="0.3" />

          {/* Connections - only showing some for visual clarity */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="80"
            stroke="#1a1a1a"
            strokeWidth="0.2"
          />
          <line
            x1="50"
            y1="150"
            x2="150"
            y2="130"
            stroke="#1a1a1a"
            strokeWidth="0.2"
          />
          <line
            x1="150"
            y1="130"
            x2="250"
            y2="100"
            stroke="#1a1a1a"
            strokeWidth="0.2"
          />
          <line
            x1="150"
            y1="180"
            x2="250"
            y2="175"
            stroke="#1a1a1a"
            strokeWidth="0.2"
          />
          <line
            x1="250"
            y1="175"
            x2="350"
            y2="150"
            stroke="#1a1a1a"
            strokeWidth="0.2"
          />
          <line
            x1="250"
            y1="250"
            x2="350"
            y2="200"
            stroke="#1a1a1a"
            strokeWidth="0.2"
          />
        </g>
      </svg>

      {/* Da Vinci style technical drawing elements */}
      <svg
        className="absolute top-10 right-10 w-32 h-32 opacity-20"
        viewBox="0 0 100 100"
      >
        {/* Vitruvian circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="0.3"
        />
        {/* Square inscribed */}
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="0.3"
          transform="rotate(45 50 50)"
        />
        {/* Golden ratio spiral hint */}
        <path
          d="M 50 50 Q 80 50 80 80 T 50 110"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="0.2"
        />
      </svg>
    </div>
  );
};

export default RenaissanceBackground;