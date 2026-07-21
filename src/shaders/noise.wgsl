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

fn curlNoise(p: vec2<f32>) -> vec2<f32> {
  // Un petit epsilon pour calculer la dérivée (la pente)
  let eps = 0.01;

  // On échantillonne le bruit autour de notre point
  let n1 = fbm(p + vec2<f32>(eps, 0.0));
  let n2 = fbm(p - vec2<f32>(eps, 0.0));
  let n3 = fbm(p + vec2<f32>(0.0, eps));
  let n4 = fbm(p - vec2<f32>(0.0, eps));

  // On calcule la différence (dérivée) pour obtenir un vecteur 2D
  let dx = (n1 - n2) / (2.0 * eps);
  let dy = (n3 - n4) / (2.0 * eps);

  // La astuce du curl : on retourne le vecteur perpendiculaire
  // Ça crée un champ de vecteurs sans divergence (de jolies swirls/tourbillons)
  return vec2<f32>(dx, -dy);
}
