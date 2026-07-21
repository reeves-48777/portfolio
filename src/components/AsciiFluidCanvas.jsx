import { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/useThemeStore';

const createAsciiAtlas = () => {
  const canvas = document.createElement('canvas');
  const charSize = 64;
  const chars = " .:-=+*#%@";
  canvas.width = charSize * chars.length;
  canvas.height = charSize;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 52px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], i * charSize + charSize / 2, charSize / 2);
  }
  return canvas;
};

// On passe les couleurs en paramètre (format RGB normalisé 0.0 - 1.0)
const buildShader = () => `
struct Uniforms {
  time: f32,
  mouseX: f32,
  mouseY: f32,
  resX: f32,
  resY: f32,
  colorR: f32,
  colorG: f32,
  colorB: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var atlasSampler: sampler;
@group(0) @binding(2) var atlasTexture: texture_2d<f32>;

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0)
  );
  return vec4<f32>(pos[vertex_index], 0.0, 1.0);
}

fn hash(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453123);
}

fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2<f32>(0.0, 0.0)), hash(i + vec2<f32>(1.0, 0.0)), u.x),
             mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), u.x), u.y);
}

fn fbm(p: vec2<f32>) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var cp = p;
  for (var i = 0; i < 5; i = i + 1) { // 5 octaves pour plus de détails organiques
    v = v + a * noise(cp);
    cp = cp * 2.0;
    a = a * 0.5;
  }
  return v;
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let res = vec2<f32>(uniforms.resX, uniforms.resY);
  let aspect = res.x / res.y;
  var uv = fragCoord.xy / res.y;

  let mouse = vec2<f32>(uniforms.mouseX * aspect, uniforms.mouseY);
  let distMouse = distance(uv, mouse);
  let mouseInfluence = smoothstep(0.4, 0.0, distMouse);

  let gridScale = 45.0;
  let cell = floor(uv * gridScale);
  let cellUV = fract(uv * gridScale);

  var p = cell * 0.15;

  // --- EFFET VIVANT ---
  // 1. Vitesse accélérée
  p.x = p.x + uniforms.time * 0.4;
  // 2. Gravité (le fluide tombe lentement)
  p.y = p.y - uniforms.time * 0.4;

  // 3. Distortion sinusoïdale (ondulation de fumée)
  p.x = p.x + sin(uniforms.time * 0.5 + cell.y * 0.2) * 0.4;
  p.y = p.y + cos(uniforms.time * 0.4 + cell.x * 0.2) * 0.3;

  p = p + (mouse - uv) * mouseInfluence * 6.0;

  let n = fbm(p);

  // Contraste adapté (2.0 au lieu de 2.5 pour un peu plus de présence)
  let contrastN = pow(max(0.0, n), 3.0);
  let charIndex = u32(clamp(contrastN, 0.0, 0.999) * 10.0);

  if (charIndex == 0u) {
    discard;
  }

  let atlasUV = vec2<f32>(
    (f32(charIndex) + cellUV.x) / 10.0,
    cellUV.y
  );

  let charMask = textureSample(atlasTexture, atlasSampler, atlasUV).r;

  // Couleurs dynamiques passées en paramètre
  let baseColor = vec3<f32>(uniforms.colorR, uniforms.colorG, uniforms.colorB);
  let finalColor = baseColor * (0.5 + n * 0.5) * charMask;

  return vec4<f32>(finalColor, charMask);
}
`;

import { cn } from "../utils/cn";
const AsciiFluidCanvas = ({ className = "" }) => {
  const isDark = useThemeStore((state) => state.isDark);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const targetColor = useRef(isDark ? { r: 1.0, g: 1.0, b: 1.0 } : { r: 0.0, g: 0.0, b: 0.0 });

  useEffect(() => {
    targetColor.current = isDark ? { r: 1.0, g: 1.0, b: 1.0 } : { r: 0.0, g: 0.0, b: 0.0 }
  }, [isDark])

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId;
    let destroyed = false;
    let resizeObserver;
    let device, context;

    const uniformData = new Float32Array(8);

    const setCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    setCanvasSize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    const initWebGPU = async () => {
      if (!navigator.gpu) return;
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter || destroyed) return;

      device = await adapter.requestDevice();
      if (destroyed) return;

      context = canvas.getContext('webgpu');
      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: 'premultiplied' });

      const atlasCanvas = createAsciiAtlas();
      const atlasTexture = device.createTexture({
        size: [atlasCanvas.width, atlasCanvas.height, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      });
      device.queue.copyExternalImageToTexture(
        { source: atlasCanvas },
        { texture: atlasTexture },
        [atlasCanvas.width, atlasCanvas.height, 1]
      );

      const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });

      const shaderCode = buildShader();

      const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: device.createShaderModule({ code: shaderCode }), entryPoint: 'vs_main' },
        fragment: { module: device.createShaderModule({ code: shaderCode }), entryPoint: 'fs_main', targets: [{ format }] },
        primitive: { topology: 'triangle-list' }
      });

      const uniformBuffer = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uniformBuffer } },
          { binding: 1, resource: sampler },
          { binding: 2, resource: atlasTexture.createView() }
        ]
      });

      window.addEventListener('mousemove', handleMouseMove);

      resizeObserver = new ResizeObserver(setCanvasSize);
      resizeObserver.observe(container);

      const start = performance.now();

      const render = () => {
        if (destroyed) return;

        const time = (performance.now() - start) / 1000;

        uniformData[0] = time;
        uniformData[1] = mouseRef.current.x;
        uniformData[2] = mouseRef.current.y;
        uniformData[3] = canvas.width;
        uniformData[4] = canvas.height;
        uniformData[5] = targetColor.current.r;
        uniformData[6] = targetColor.current.g;
        uniformData[7] = targetColor.current.b;

        device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer);

        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();

        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: textureView,
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: 'clear',
            storeOp: 'store'
          }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.draw(6);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);
        animationFrameId = requestAnimationFrame(render);
      };

      render();
    };

    initWebGPU();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);

      if (device) {
        device.destroy();
      }
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block" />
    </div>
  );
};

export default AsciiFluidCanvas;
