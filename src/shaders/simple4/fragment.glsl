#ifdef GL_ES
    precision mediump float;
#endif

uniform float u_time;
uniform float u_rows;
uniform float u_spacing;

varying vec2 vUv;

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * (43758.5453123 + u_time));
}
void main()
{
    float x = floor(vUv.x * u_rows) /u_rows;
    float y = floor(vUv.y * u_rows) /u_rows;
    float random = rand(vec2(x,y));
    gl_FragColor = vec4(0, random, 0, 1.0);
}
