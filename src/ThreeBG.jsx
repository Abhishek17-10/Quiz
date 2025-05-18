import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  OrbitControls, 
  Stars, 
  MeshDistortMaterial, 
  MeshWobbleMaterial,
  GradientTexture,
  Float,
  Html,
  Trail,
  PerformanceMonitor
} from '@react-three/drei';

// Enhanced floating shape with custom materials and interactive effects
function FloatingShape({ 
  geometry, 
  position, 
  scale, 
  speed, 
  distort = false, 
  wobble = false,
  gradient = false,
  trailColor = "#ffffff",
  trailWidth = 1,
  trailLength = 20
}) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Animate based on time and interactions
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    
    // Base movement animation
    ref.current.position.y = position[1] + Math.sin(t) * 0.5;
    
    // Additional animations based on interactions
    if (clicked) {
      ref.current.rotation.x = t * 0.5;
      ref.current.rotation.y = t * 0.8;
      ref.current.rotation.z = t * 0.3;
    } else {
      ref.current.rotation.x = t * 0.3;
      ref.current.rotation.y = t * 0.5;
    }
    
    // Pulsing effect when hovered
    if (hovered) {
      const pulse = Math.sin(t * 5) * 0.05 + 1;
      ref.current.scale.set(
        scale[0] * pulse,
        scale[1] * pulse,
        scale[2] * pulse
      );
    }
  });

  // Handle material selection based on props
  const Material = useMemo(() => {
    if (distort) {
      return (
        <MeshDistortMaterial
          color={clicked ? "#ffffff" : hovered ? "#aaffff" : "#88ccff"}
          speed={2}
          distort={hovered ? 0.6 : 0.4}
          radius={1}
          roughness={0.2}
          metalness={0.8}
        />
      );
    } else if (wobble) {
      return (
        <MeshWobbleMaterial
          color={clicked ? "#ffaaff" : hovered ? "#ffee88" : "#ff88ee"}
          factor={hovered ? 1 : 0.4}
          speed={clicked ? 5 : 2}
          roughness={0.3}
          metalness={0.7}
        />
      );
    } else if (gradient) {
      return (
        <meshPhongMaterial>
          <GradientTexture
            stops={[0, 0.3, 0.6, 1]}
            colors={['#5d00ff', '#00ddff', '#00ffaa', hovered ? '#ffff00' : '#33bbff']}
            size={100}
          />
        </meshPhongMaterial>
      );
    } else {
      return (
        <meshStandardMaterial
          color={clicked ? "#66ffaa" : hovered ? "#aaddff" : "#6c5ce7"}
          emissive={clicked ? "#00ff88" : hovered ? "#0088ff" : "#4a32b9"}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      );
    }
  }, [distort, wobble, gradient, hovered, clicked]);

  return (
    <Trail 
      local
      width={trailWidth}
      length={trailLength}
      color={trailColor}
      attenuation={(w) => (clicked ? w : w * 0.5)}
      enabled={hovered || clicked}
    >
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.2}
      >
        <mesh
          ref={ref}
          position={position}
          scale={scale}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
          castShadow
          receiveShadow
        >
          {geometry}
          {Material}
        </mesh>
      </Float>
    </Trail>
  );
}

// Interactive particles effect
function ParticleField({ count = 100 }) {
  const { viewport } = useThree();
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2;
      const y = (Math.random() - 0.5) * viewport.height * 2;
      const z = (Math.random() - 0.5) * 10;
      const size = 0.03 + Math.random() * 0.05;
      temp.push({ x, y, z, size });
    }
    return temp;
  }, [viewport, count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((particle, i) => {
      // Move particles in a wave pattern
      const { x, y, z, size } = particle;
      dummy.position.set(
        x + Math.sin(t * 0.1 + i) * 0.2,
        y + Math.cos(t * 0.1 + i) * 0.2,
        z
      );
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  );
}

// Mouse follower light
function MouseLight() {
  const light = useRef();
  const [position, setPosition] = useState([0, 0, 5]);

  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    setPosition([x, y, 5]);
  });

  return (
    <pointLight
      ref={light}
      position={position}
      intensity={5}
      distance={10}
      color="#ffffff"
    />
  );
}

// Dynamic responsive background
function BackgroundGradient() {
  const mesh = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    if (mesh.current.material.uniforms) {
      mesh.current.material.uniforms.time.value = t;
    }
  });

  // Create animated shader material for background
  const shaderData = {
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color("#1a237e") },
      color2: { value: new THREE.Color("#673ab7") },
      color3: { value: new THREE.Color("#0d47a1") }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;
      
      void main() {
        float noise1 = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time) * 0.5 + 0.5;
        float noise2 = sin(vUv.x * 5.0 - time * 0.5) * sin(vUv.y * 7.0 + time * 0.7) * 0.5 + 0.5;
        
        vec3 colorA = mix(color1, color2, noise1);
        vec3 finalColor = mix(colorA, color3, noise2);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  };

  return (
    <mesh ref={mesh} position={[0, 0, -10]} scale={[30, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        attach="material"
        args={[shaderData]}
      />
    </mesh>
  );
}

// Performance monitoring and adaptive quality
function AdaptiveScene({ children }) {
  const [dpr, setDpr] = useState(1.5);
  
  return (
    <>
      <PerformanceMonitor 
        onIncline={() => setDpr(Math.min(2, dpr + 0.5))}
        onDecline={() => setDpr(Math.max(0.75, dpr - 0.5))}
      >
        <scene>{children}</scene>
      </PerformanceMonitor>
    </>
  );
}

// Primary component
export default function ThreeBG() {
  const [reduced, setReduced] = useState(false);
  
  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    
    const handleChange = (e) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        shadows
        dpr={window.devicePixelRatio}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#030014"]} />
        <fog attach="fog" args={["#070425", 5, 30]} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#3370ff" />
        <MouseLight />
        
        <AdaptiveScene>
          {/* Background elements */}
          <BackgroundGradient />
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={reduced ? 2 : 4} 
            saturation={0.5}
            fade
            speed={reduced ? 0 : 1}
          />
          
          {/* Interactive and decorative elements */}
          {!reduced && <ParticleField count={80} />}
          
          {/* Primary floating shapes */}
          <FloatingShape
            geometry={<dodecahedronGeometry args={[1.4, 1]} />} 
            position={[-4, 2, 0]}
            scale={[1, 1, 1]}
            speed={0.6}
            distort={true}
            trailColor="#22ccff"
          />
          <FloatingShape
            geometry={<torusKnotGeometry args={[0.8, 0.3, 128, 32]} />}
            position={[3.5, 0, 1]}
            scale={[1, 1, 1]}
            speed={0.8}
            wobble={true}
            trailColor="#ff55cc"
          />
          <FloatingShape
            geometry={<icosahedronGeometry args={[1, 1]} />}
            position={[0, -3, 2]}
            scale={[1.2, 1.2, 1.2]}
            speed={0.4}
            gradient={true}
            trailColor="#44ffaa"
          />
          <FloatingShape
            geometry={<octahedronGeometry args={[0.8, 0]} />}
            position={[-3, -2, -1]}
            scale={[0.8, 0.8, 0.8]}
            speed={1.2}
            trailColor="#ffcc22"
          />
          
          {/* Camera controls */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={!reduced}
            autoRotate={!reduced}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </AdaptiveScene>
      </Canvas>
    </div>
  );
}


