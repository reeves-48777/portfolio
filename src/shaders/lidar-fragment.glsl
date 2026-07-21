uniform float uTime;
uniform vec3 uColor;
varying float vViewY;
void main() {
    // diamond shape points
    vec2 uv = gl_PointCoord - vec2(0.5);
    if (abs(uv.x) + abs(uv.y) > 0.5) discard;

    // --- SCANLINE IN CAMERA SPACE
    // mod(uTime * vitesse, amplitude_max) - limite_basse
    float scanY = mod(uTime * 2.0, 4.0) - 2.0;
    float dist = abs(vViewY - scanY);

    float scan = smoothstep(0.8, 0.0, dist);

    // float coreScan = smoothstep(0.05, 0.0, dist);
    // float haloScan = smoothstep(0.3, 0.0, dist);

    // Intensité finale
    // float alpha = 0.15 + haloScan * 0.35 + coreScan * 0.5;
    float alpha = 0.2 + scan * 0.8;

    gl_FragColor = vec4(uColor, alpha);
}
