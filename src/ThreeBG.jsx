import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

function FloatingShape({ geometry, color, position, scale, speed }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.5; // up/down float
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  );
}

export default function ThreeBG() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)', // cool gradient bg
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        shadows
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.7} />

        {/* Floating shapes */}
        <FloatingShape
          geometry={<boxGeometry args={[1.5, 1.5, 1.5]} />}
          color="#ff6f91"
          position={[-3, 0, 0]}
          scale={[1, 1, 1]}
          speed={0.7}
        />
        <FloatingShape
          geometry={<sphereGeometry args={[1, 32, 32]} />}
          color="#6c5ce7"
          position={[2, 1.5, -1]}
          scale={[1.2, 1.2, 1.2]}
          speed={1}
        />
        <FloatingShape
          geometry={<torusGeometry args={[1, 0.3, 16, 100]} />}
          color="#00b894"
          position={[0, -2, 1]}
          scale={[1.5, 1.5, 1.5]}
          speed={0.5}
        />

        {/* Ambient stars for depth */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />

        {/* Optional camera controls for interaction (disable zoom) */}
        <OrbitControls enableZoom={false} enablePan={false} />

      </Canvas>
    </div>
  );
}


