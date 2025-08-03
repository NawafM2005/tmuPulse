"use client"

import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import { useEffect, useState } from 'react';

export default function AnimatedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [animationOffset, setAnimationOffset] = useState(0);
  const [particleOffset, setParticleOffset] = useState(0);

  // Animate the dash offset for flowing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 20);
      setParticleOffset(prev => (prev + 2) % 100);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main animated edge */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeDasharray: '10,5',
          strokeDashoffset: animationOffset,
          filter: 'drop-shadow(0 0 8px rgba(249, 221, 74, 0.6))',
          strokeLinecap: 'round',
        }}
      />
      
      {/* Secondary glow edge */}
      <BaseEdge 
        path={edgePath} 
        style={{
          stroke: '#F9DD4A',
          strokeWidth: 1,
          strokeDasharray: '5,10',
          strokeDashoffset: -animationOffset,
          opacity: 0.4,
          filter: 'blur(1px)',
        }}
      />
      
      {/* Animated particles along the edge */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX + Math.sin(particleOffset * 0.1) * 20}px,${labelY + Math.cos(particleOffset * 0.1) * 10}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="relative">
            {/* Main animated particle */}
            <div 
              className="w-3 h-3 bg-[#F9DD4A] rounded-full"
              style={{
                boxShadow: '0 0 15px rgba(249, 221, 74, 0.9), 0 0 25px rgba(249, 221, 74, 0.6)',
                animation: 'spiralPulse 2s infinite ease-in-out',
              }}
            />
            
            {/* Trail particles */}
            <div 
              className="absolute w-2 h-2 bg-[#F9DD4A] rounded-full opacity-60"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${-Math.sin(particleOffset * 0.08) * 15}px, ${-Math.cos(particleOffset * 0.08) * 8}px)`,
                animation: 'glow 1.5s infinite alternate',
              }}
            />
            
            <div 
              className="absolute w-1 h-1 bg-[#F9DD4A] rounded-full opacity-30"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${-Math.sin(particleOffset * 0.06) * 25}px, ${-Math.cos(particleOffset * 0.06) * 12}px)`,
              }}
            />
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
