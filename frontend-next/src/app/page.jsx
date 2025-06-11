import Link from "next/link";
import RenaissanceBackground from "../components/RenaissanceBackground";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-coral-50/20 via-white to-orange-50/20 relative overflow-hidden"
      style={{ height: "100vh" }}
    >
      <RenaissanceBackground opacity={0.1} />

      <div className="relative z-10 h-full flex flex-col justify-center items-center px-8">
        {/* Renaissance frame decorations */}
        <div className="relative">
          <div className="absolute -top-12 -left-16 w-16 h-16 opacity-40">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path
                d="M 0 0 L 48 0 L 48 12 L 12 12 L 12 48 L 0 48 Z"
                fill="none"
                stroke="#dc7454"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="absolute -top-12 -right-16 w-16 h-16 opacity-40">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path
                d="M 48 0 L 0 0 L 0 12 L 36 12 L 36 48 L 48 48 Z"
                fill="none"
                stroke="#dc7454"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="absolute -bottom-12 -left-16 w-16 h-16 opacity-40">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path
                d="M 0 48 L 48 48 L 48 36 L 12 36 L 12 0 L 0 0 Z"
                fill="none"
                stroke="#dc7454"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="absolute -bottom-12 -right-16 w-16 h-16 opacity-40">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path
                d="M 48 48 L 0 48 L 0 36 L 36 36 L 36 0 L 48 0 Z"
                fill="none"
                stroke="#dc7454"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="text-center space-y-6">
            {/* Floating mathematical annotations */}
            <div className="absolute -left-32 top-0 opacity-20 font-serif italic text-sm text-coral-600 hidden lg:block">
              π ≈ 3.14159...
            </div>
            <div className="absolute -right-32 top-12 opacity-20 font-serif italic text-sm text-coral-600 hidden lg:block">
              φ = (1+√5)/2
            </div>

            <h1 className="text-8xl font-light tracking-tight text-gray-900 font-serif mb-4">
              Claude Use Case Explorer
            </h1>

            {/* Decorative divider */}
            <div className="flex items-center justify-center space-x-6 my-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-coral-500/60 to-coral-500/40"></div>

              {/* Central medallion */}
              <svg
                width="56"
                height="56"
                viewBox="0 0 48 48"
                className="transform hover:rotate-180 transition-transform duration-700"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#dc7454"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="15"
                  fill="none"
                  stroke="#dc7454"
                  strokeWidth="0.8"
                  opacity="0.8"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="10"
                  fill="none"
                  stroke="#dc7454"
                  strokeWidth="1"
                />

                {/* Inner geometric pattern */}
                <g transform="translate(24,24)">
                  <path
                    d="M -8 0 L 8 0 M 0 -8 L 0 8"
                    stroke="#dc7454"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M -6 -6 L 6 6 M -6 6 L 6 -6"
                    stroke="#dc7454"
                    strokeWidth="0.3"
                  />
                  <circle cx="0" cy="0" r="3" fill="#dc7454" opacity="0.3" />
                </g>
              </svg>

              <div className="h-px w-32 bg-gradient-to-l from-transparent via-coral-500/60 to-coral-500/40"></div>
            </div>

            <p className="text-2xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
              Calculate the ROI of implementing Claude AI for your business with
              124 real case studies from Fortune 500 and startups alike
            </p>

            <div className="pt-8 flex justify-center space-x-6">
              <Link
                href="/analyzer"
                className="group relative px-12 py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 transition-all duration-300"
              >
                <div className="absolute inset-0 border border-white/20"></div>
                <span className="relative z-10 flex items-center justify-center space-x-3 text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 2L13.09 7.26C13.18 7.67 13.64 7.87 13.99 7.65L18.24 5.24L16.97 10.01C16.85 10.42 17.18 10.8 17.6 10.73L22 10L19.59 14.41C19.36 14.76 19.56 15.22 19.97 15.31L24 16L19.73 18.09C19.32 18.18 19.13 18.64 19.35 18.99L21.76 23.24L16.99 21.97C16.58 21.85 16.2 22.18 16.27 22.6L17 27L14.59 22.59C14.24 22.36 13.78 22.56 13.69 22.97L13 27L12 22L10.91 16.74C10.82 16.33 10.36 16.13 10.01 16.35L5.76 18.76L7.03 13.99C7.15 13.58 6.82 13.2 6.4 13.27L2 14L4.41 9.59C4.64 9.24 4.44 8.78 4.03 8.69L0 8L4.27 5.91C4.68 5.82 4.87 5.36 4.65 5.01L2.24 0.76L7.01 2.03C7.42 2.15 7.8 1.82 7.73 1.4L7 -3L9.41 1.41C9.76 1.64 10.22 1.44 10.31 1.03L11 -3L12 2"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  </svg>
                  <span className="text-sm font-medium tracking-wider uppercase">
                    Commence Analysis
                  </span>
                </span>
              </Link>

              <Link
                href="/case-studies"
                className="group relative px-12 py-4 bg-white border-2 border-coral-500 hover:bg-coral-50 transition-all duration-300"
              >
                <span className="relative z-10 text-coral-600 text-sm font-medium tracking-wider uppercase">
                  Browse Case Studies
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
