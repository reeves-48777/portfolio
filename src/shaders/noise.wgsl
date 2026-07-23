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

fn fbm(p: vec2<f32>, octaves: u32) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var cp = p;
  for (var i = 0u; i < octaves; i = i + 1) { // 5 octaves pour plus de détails organiques
    v = v + a * noise(cp);
    cp = cp * 2.0;
    a = a * 0.5;
  }
  return v;
}
