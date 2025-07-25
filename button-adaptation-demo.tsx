import React from 'react';
import { CopyButton } from './CopyButton'; // Assuming the button is imported

export default function ButtonAdaptationDemo() {
  const backgrounds = [
    { name: 'Pure White', bg: 'bg-white', color: 'text-gray-900' },
    { name: 'Light Gray', bg: 'bg-gray-100', color: 'text-gray-900' },
    { name: 'Blue Gradient', bg: 'bg-gradient-to-br from-blue-50 to-indigo-100', color: 'text-blue-900' },
    { name: 'Dark Blue', bg: 'bg-blue-900', color: 'text-white' },
    { name: 'Black', bg: 'bg-black', color: 'text-white' },
    { name: 'Purple Gradient', bg: 'bg-gradient-to-r from-purple-600 to-pink-600', color: 'text-white' },
    { name: 'Green', bg: 'bg-green-600', color: 'text-white' },
    { name: 'Warm Gradient', bg: 'bg-gradient-to-br from-orange-400 to-red-500', color: 'text-white' }
  ];

  const customStyles = `
    @keyframes shimmer {
      0% { transform: translateX(-100%) skewX(-12deg); }
      100% { transform: translateX(200%) skewX(-12deg); }
    }
    
    @keyframes animate-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    
    .animate-shimmer { animation: shimmer 1s ease-out; }
    .animate-reverse { animation: animate-reverse 1s linear infinite; }
  `;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Adaptive Copy Button Design
          </h1>
          <p className="text-gray-600 text-lg">
            See how the button elegantly adapts to different backgrounds
          </p>
        </header>

        {/* Grid of different backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {backgrounds.map((bg, index) => (
            <div
              key={index}
              className={`${bg.bg} p-6 rounded-xl shadow-lg min-h-[200px] flex flex-col justify-between`}
            >
              <div copy={index + 1}>
                <h3 className={`font-semibold mb-2 ${bg.color}`}>{bg.name}</h3>
                <p className={`text-sm mb-4 ${bg.color} opacity-80`}>
                  The glass button automatically adapts to this background.
                </p>
              </div>
              <CopyButton variant="glass" adaptive />
            </div>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6" copy="9">Button Variants Showcase</h2>
          
          <div className="space-y-8">
            {/* Glass Variant */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-3" copy="10">Glass Morphism</h3>
              <p className="text-gray-600 mb-4" copy="11">
                Frosted glass effect with backdrop blur that creates a premium, modern look.
              </p>
              <div className="flex flex-wrap gap-3">
                <CopyButton variant="glass">Default Glass</CopyButton>
                <CopyButton variant="glass" iconOnly />
                <CopyButton variant="glass" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  With Gradient
                </CopyButton>
              </div>
            </div>

            {/* Tech Variant */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-3" copy="12">Tech Style</h3>
              <p className="text-gray-600 mb-4" copy="13">
                Futuristic design with cyan glow effect, perfect for technical applications.
              </p>
              <div className="flex flex-wrap gap-3">
                <CopyButton variant="tech">Tech Button</CopyButton>
                <CopyButton variant="tech" iconOnly />
                <CopyButton variant="tech" format="markdown">Copy as Markdown</CopyButton>
              </div>
            </div>

            {/* Minimal Variant */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-3" copy="14">Minimal</h3>
              <p className="text-gray-600 mb-4" copy="15">
                Subtle and clean, perfect for inline use within content areas.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <span>Some text content</span>
                <CopyButton variant="minimal" iconOnly />
                <span>or with label</span>
                <CopyButton variant="minimal">Copy</CopyButton>
              </div>
            </div>

            {/* Animation States */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Interactive States</h3>
              <p className="text-gray-600 mb-4">
                Try hovering, clicking, and copying to see the smooth animations and feedback.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Hover me</p>
                  <CopyButton variant="glass">Hover Effect</CopyButton>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Click me</p>
                  <CopyButton variant="glass">Press Effect</CopyButton>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Success state</p>
                  <CopyButton variant="glass">Copy Me</CopyButton>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Icon animation</p>
                  <CopyButton variant="glass" iconOnly />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complex Layout Example */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6" copy="16">Dark Theme Example</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div copy="17">
              <h3 className="text-lg font-semibold mb-3">Adaptive Design</h3>
              <p className="text-gray-300 mb-4">
                Notice how the glass button automatically switches to light mode when placed on dark backgrounds. 
                The translucent effect creates a beautiful contrast while maintaining readability.
              </p>
              <CopyButton variant="glass" />
            </div>
            
            <div copy="18">
              <h3 className="text-lg font-semibold mb-3">Multiple Actions</h3>
              <p className="text-gray-300 mb-4">
                You can have multiple copy buttons with different formats in the same area.
              </p>
              <div className="flex gap-3">
                <CopyButton variant="glass" format="text">Text</CopyButton>
                <CopyButton variant="glass" format="markdown">MD</CopyButton>
                <CopyButton variant="glass" format="html">HTML</CopyButton>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <CopyButton
          variant="floating"
          className="bg-gradient-to-br from-indigo-600/90 to-purple-600/90 text-white"
        />
      </div>
    </div>
  );
}