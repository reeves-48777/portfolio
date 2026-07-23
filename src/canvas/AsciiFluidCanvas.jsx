import { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/useThemeStore';

import mainCode from '../shaders/ascii-fluid.wgsl?raw';
import noiseCode from '../shaders/noise.wgsl?raw';

const shaderCode = `${noiseCode}\n${mainCode}`;

const isLowPowerDevice = () => {
  if (typeof window === "undefined") return false;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  return isTouch || isSmallScreen;
}

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

import { cn } from "../utils/cn";
const AsciiFluidCanvas = ({ className = "" }) => {
  const isDark = useThemeStore((state) => state.isDark());

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
    let intersectionObserver;
    let device, context;

    let isVisible = true;
    let isTabVisible = document.visibilityState === 'visible';
    const shouldRender = () => isVisible && isTabVisible;

    const lowPower = isLowPowerDevice();
    const maxDpr = lowPower ? 1 : 2;
    const octaves = lowPower ? 3.0 : 5.0;

    const uniformData = new Float32Array(9);

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

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (shouldRender() && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

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

      const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: device.createShaderModule({ code: shaderCode }), entryPoint: 'vs_main' },
        fragment: { module: device.createShaderModule({ code: shaderCode }), entryPoint: 'fs_main', targets: [{ format }] },
        primitive: { topology: 'triangle-list' }
      });

      const uniformBuffer = device.createBuffer({
        size: 48,
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
      document.addEventListener('visibilitychange', handleVisibilityChange);

      resizeObserver = new ResizeObserver(setCanvasSize);
      resizeObserver.observe(container);

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
          if (shouldRender() && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        },
        {
          threshold: 0
        }
      );
      intersectionObserver.observe(container);

      const start = performance.now();

      const render = () => {
        if (destroyed) return;

        if (!shouldRender()) {
          animationFrameId = null;
          return;
        }

        const time = (performance.now() - start) / 1000;

        uniformData[0] = time;
        uniformData[1] = mouseRef.current.x;
        uniformData[2] = mouseRef.current.y;
        uniformData[3] = canvas.width;
        uniformData[4] = canvas.height;
        uniformData[5] = targetColor.current.r;
        uniformData[6] = targetColor.current.g;
        uniformData[7] = targetColor.current.b;
        uniformData[8] = octaves;

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
