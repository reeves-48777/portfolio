varying float vViewY;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewY = mvPosition.y;
    gl_PointSize = 2.0 * (10.0 / -mvPosition.z); // Taille des points selon la distance
    gl_Position = projectionMatrix * mvPosition;
}
