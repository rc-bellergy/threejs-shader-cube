#ifdef GL_ES
    precision mediump float;
#endif

uniform float u_time;

varying vec2 vUv;

void main()
{
    float  s = step(0.9, mod(vUv.y * 20.0, 1.0)); // V-line
    s *= step(0.9, mod(vUv.x * 20.0, 1.0)); // H-line

    gl_FragColor = vec4(0, s, 0, s);
}