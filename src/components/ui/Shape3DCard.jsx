import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Pixelation } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useThemeStore } from '../../store/useThemeStore';

import vertexShader from '../../shaders/lidar-vertex.glsl?raw';
import fragmentShader from '../../shaders/lidar-fragment.glsl?raw';

const WireShape = ({ type, color, variant }) => {
  const ref = useRef();
  const matRef = useRef();
  const baseRotation = useRef({ x: 0, y: 0 });

  // Mémoïsation des uniforms du shader
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), [color]);

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uColor.value.set(color);
    }
  }, [color]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    if (ref.current) {
      baseRotation.current.x += 0.3 * delta;
      baseRotation.current.y += 0.5 * delta;

      const { x, y } = state.pointer;

      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, baseRotation.current.x + y * 0.5, 0.1);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, baseRotation.current.y + x * 0.5, 0.1);
    }
  });

  // Variant Ghost (Wireframe transparent)
  if (variant === 'ghost') {
    return (
      <mesh ref={ref}>
        {type === 'cube' && <boxGeometry args={[1.6, 1.6, 1.6]} />}
        {type === 'ico' && <icosahedronGeometry args={[1.2, 1]} />}
        <meshBasicMaterial color={color} wireframe={true} transparent={true} opacity={0.4} />
      </mesh>
    );
  }

  // Variant Lidar (Points + Shader)
  if (variant === 'lidar') {
    return (
      <points ref={ref}>
        {type === 'cube' && <boxGeometry args={[1.6, 1.6, 1.6, 6, 6, 6]} />}
        {type === 'ico' && <icosahedronGeometry args={[1.2, 3]} />}
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
        />
      </points>
    );
  }

  // Variant Solid (Défaut)
  return (
    <mesh ref={ref}>
      {type === 'cube' && <boxGeometry args={[1.6, 1.6, 1.6]} />}
      {type === 'ico' && <icosahedronGeometry args={[1.2, 1]} />}
      <meshBasicMaterial color={color} wireframe={true} />
    </mesh>
  );
};

import { cn } from '../../utils/cn';
const Shape3DCard = ({ type = 'cube', label = 'NODE_01', variant = 'solid', className, ...props }) => {
  const isDark = useThemeStore((state) => state.isDark());

  const activeColor = isDark ? '#ceff00' : '#1a1a1a';

  // Gestion du style de la bordure selon le variant
  const isGhost = variant === 'ghost';
  const containerClass = isGhost
    ? `border-2 bg-transparent transition-colors duration-300`
    : `border-2 border-border-base bg-surface overflow-hidden group hover:border-accent transition-colors duration-300`;

  const containerStyle = isGhost ? { borderColor: activeColor } : {};

  return (
    <div className={cn("relative w-full aspect-square", containerClass, className)} style={containerStyle}>
      {/* On cache les coins techy si c'est ghost pour garder le côté épuré */}
      {!isGhost && (
        <>
          <div className="absolute top-2 left-2 z-10 text-[10px] font-pixel font-extrabold text-muted group-hover:text-accent transition-colors uppercase tracking-widest">
            &gt; {label}
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-techy group-hover:border-transparent"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-techy group-hover:border-transparent"></div>
        </>
      )}

      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} className="cursor-pointer">
        <WireShape type={type} color={activeColor} variant={variant} />

        <EffectComposer>
          <Pixelation granularity={1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Shape3DCard;
