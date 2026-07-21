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

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let res = vec2<f32>(uniforms.resX, uniforms.resY);
  let aspect = res.x / res.y;
  var uv = fragCoord.xy / res.y;

  let mouse = vec2<f32>(uniforms.mouseX * aspect, uniforms.mouseY);
  let distMouse = distance(uv, mouse);
  let mouseInfluence = smoothstep(0.4, 0.0, distMouse);

  let charPixelSize = 10.0;
  let gridScale = res.y / charPixelSize;

  let cell = floor(uv * gridScale);
  let cellUV = fract(uv * gridScale);

  /// --- CORRECTION DE BRUIT ---
  // Si gridScale augmente, le bruit devient trop petit
  // On va le "compenser" en divisant par l'echelle de référence (45.0)
  let noiseScale = 45.0 / gridScale;
  var p = cell * 0.15 * noiseScale;

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
