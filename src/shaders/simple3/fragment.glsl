#ifdef GL_ES
    precision mediump float;
#endif

uniform float u_time;
uniform float u_rows;
uniform float u_spacing;

varying vec2 vUv;

void main()
{
    float x = floor(vUv.x * u_rows) /u_rows;
    float y = floor(vUv.y * u_rows) /u_rows;
    float barX = step(u_spacing, mod(vUv.x * u_rows, 1.0));
    gl_FragColor = vec4(x, y, barX, 1.0);
}