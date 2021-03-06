#ifdef GL_ES
    precision mediump float;
#endif

uniform float u_time;
uniform float u_rows;
uniform float u_spacing;

varying vec2 vUv;

void main()
{
    float margin = u_spacing * 0.25;

    float barX = step(u_spacing * 0.5, mod(vUv.x * u_rows + margin, 1.0));
    barX *= step(u_spacing, mod(vUv.y * u_rows + u_spacing * 0.25 + margin + u_time, 1.0)); 

    float barY = step(u_spacing, mod(vUv.x * u_rows + u_spacing * 0.25 + margin + u_time, 1.0));
    barY *= step(u_spacing * 0.5, mod(vUv.y * u_rows + margin, 1.0));

    float s = barX + barY;

    gl_FragColor = vec4(0.0, s, 0.0, 1.0);
}