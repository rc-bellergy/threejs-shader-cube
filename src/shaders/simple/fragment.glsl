#ifdef GL_ES
    precision mediump float;
#endif

uniform float u_time;
uniform float u_rows;
uniform float u_spacing;

varying vec2 vUv;

void main()
{
    float s = step(u_spacing, mod(vUv.y * u_rows, 1.0));
    s *= step(u_spacing, mod(vUv.x * u_rows, 1.0));
    gl_FragColor = vec4(0.0, s, 0.0, 1.0);
}