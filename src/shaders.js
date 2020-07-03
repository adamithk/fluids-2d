const AdvectShader = `uniform sampler2D velocity;
uniform sampler2D advected;

uniform vec2 gridSize;
uniform float gridScale;

uniform float timestep;
uniform float dissipation;

vec2 bilerp(sampler2D d, vec2 p)
{
    vec4 ij; // i0, j0, i1, j1
    ij.xy = floor(p - 0.5) + 0.5;
    ij.zw = ij.xy + 1.0;

    vec4 uv = ij / gridSize.xyxy;
    vec2 d11 = texture2D(d, uv.xy).xy;
    vec2 d21 = texture2D(d, uv.zy).xy;
    vec2 d12 = texture2D(d, uv.xw).xy;
    vec2 d22 = texture2D(d, uv.zw).xy;

    vec2 a = p - ij.xy;

    return mix(mix(d11, d21, a.x), mix(d12, d22, a.x), a.y);
}

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;
    float scale = 1.0 / gridScale;

    // trace point back in time
    vec2 p = gl_FragCoord.xy - timestep * scale * texture2D(velocity, uv).xy;

    gl_FragColor = vec4(dissipation * bilerp(advected, p), 0.0, 1.0);
}
`;

const BasicShader = `varying vec2 texCoord;

void main()
{
    texCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BoundaryShader = `uniform sampler2D read;

uniform vec2 gridSize;
uniform vec2 gridOffset;
uniform float scale;

void main()
{
    vec2 uv = (gl_FragCoord.xy + gridOffset.xy) / gridSize.xy;
    gl_FragColor = vec4(scale * texture2D(read, uv).xyz, 1.0);
}
`;

const DisplayScalarShader = `uniform sampler2D read;

uniform vec3 bias;
uniform vec3 scale;

varying vec2 texCoord;

void main()
{
    gl_FragColor = vec4(bias + scale * texture2D(read, texCoord).xxx, 1.0);
}
`;

const DisplayVectorShader = `uniform sampler2D read;

uniform vec3 bias;
uniform vec3 scale;

varying vec2 texCoord;

void main()
{
    gl_FragColor = vec4(bias + scale * texture2D(read, texCoord).xyz, 1.0);
}
`;

const DivergenceShader = `uniform sampler2D velocity;

uniform vec2 gridSize;
uniform float gridScale;

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;

    vec2 xOffset = vec2(1.0 / gridSize.x, 0.0);
    vec2 yOffset = vec2(0.0, 1.0 / gridSize.y);

    float vl = texture2D(velocity, uv - xOffset).x;
    float vr = texture2D(velocity, uv + xOffset).x;
    float vb = texture2D(velocity, uv - yOffset).y;
    float vt = texture2D(velocity, uv + yOffset).y;

    float scale = 0.5 / gridScale;
    float divergence = scale * (vr - vl + vt - vb);

    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
}
`;

const GradientShader = `uniform sampler2D p;
uniform sampler2D w;

uniform vec2 gridSize;
uniform float gridScale;

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;

    vec2 xOffset = vec2(1.0 / gridSize.x, 0.0);
    vec2 yOffset = vec2(0.0, 1.0 / gridSize.y);

    float pl = texture2D(p, uv - xOffset).x;
    float pr = texture2D(p, uv + xOffset).x;
    float pb = texture2D(p, uv - yOffset).x;
    float pt = texture2D(p, uv + yOffset).x;

    float scale = 0.5 / gridScale;
    vec2 gradient = scale * vec2(pr - pl, pt - pb);

    vec2 wc = texture2D(w, uv).xy;

    gl_FragColor = vec4(wc - gradient, 0.0, 1.0);
}
`;

const JacobiScalarShader = `uniform sampler2D x;
uniform sampler2D b;

uniform vec2 gridSize;

uniform float alpha;
uniform float beta;

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;

    vec2 xOffset = vec2(1.0 / gridSize.x, 0.0);
    vec2 yOffset = vec2(0.0, 1.0 / gridSize.y);

    float xl = texture2D(x, uv - xOffset).x;
    float xr = texture2D(x, uv + xOffset).x;
    float xb = texture2D(x, uv - yOffset).x;
    float xt = texture2D(x, uv + yOffset).x;

    float bc = texture2D(b, uv).x;

    gl_FragColor = vec4((xl + xr + xb + xt + alpha * bc) / beta, 0.0, 0.0, 1.0);
}
`;

const JacobiVectorShader = `uniform sampler2D x;
uniform sampler2D b;

uniform vec2 gridSize;

uniform float alpha;
uniform float beta;

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;

    vec2 xOffset = vec2(1.0 / gridSize.x, 0.0);
    vec2 yOffset = vec2(0.0, 1.0 / gridSize.y);

    vec2 xl = texture2D(x, uv - xOffset).xy;
    vec2 xr = texture2D(x, uv + xOffset).xy;
    vec2 xb = texture2D(x, uv - yOffset).xy;
    vec2 xt = texture2D(x, uv + yOffset).xy;

    vec2 bc = texture2D(b, uv).xy;

    gl_FragColor = vec4((xl + xr + xb + xt + alpha * bc) / beta, 0.0, 1.0);
}
`;

const SplatShader = `uniform sampler2D read;

uniform vec2 gridSize;

uniform vec3 color;
uniform vec2 point;
uniform float radius;

float gauss(vec2 p, float r)
{
    return exp(-dot(p, p) / r);
}

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;
    vec3 base = texture2D(read, uv).xyz;
    vec2 coord = point.xy - gl_FragCoord.xy;
    vec3 splat = color * gauss(coord, gridSize.x * radius);
    gl_FragColor = vec4(base + splat, 1.0);
}`;

const VorticityShader = `uniform sampler2D velocity;

uniform vec2 gridSize;
uniform float gridScale;

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;

    vec2 xOffset = vec2(1.0 / gridSize.x, 0.0);
    vec2 yOffset = vec2(0.0, 1.0 / gridSize.y);

    float vl = texture2D(velocity, uv - xOffset).y;
    float vr = texture2D(velocity, uv + xOffset).y;
    float vb = texture2D(velocity, uv - yOffset).x;
    float vt = texture2D(velocity, uv + yOffset).x;

    float scale = 0.5 / gridScale;
    gl_FragColor = vec4(scale * (vr - vl - vt + vb), 0.0, 0.0, 1.0);
}
`;

const VorticityForceShader = `uniform sampler2D velocity;
uniform sampler2D vorticity;

uniform vec2 gridSize;
uniform float gridScale;

uniform float timestep;
uniform float epsilon;
uniform vec2 curl;

void main()
{
    vec2 uv = gl_FragCoord.xy / gridSize.xy;

    vec2 xOffset = vec2(1.0 / gridSize.x, 0.0);
    vec2 yOffset = vec2(0.0, 1.0 / gridSize.y);

    float vl = texture2D(vorticity, uv - xOffset).x;
    float vr = texture2D(vorticity, uv + xOffset).x;
    float vb = texture2D(vorticity, uv - yOffset).x;
    float vt = texture2D(vorticity, uv + yOffset).x;
    float vc = texture2D(vorticity, uv).x;

    float scale = 0.5 / gridScale;
    vec2 force = scale * vec2(abs(vt) - abs(vb), abs(vr) - abs(vl));
    float lengthSquared = max(epsilon, dot(force, force));
    force *= inversesqrt(lengthSquared) * curl * vc;
    force.y *= -1.0;

    vec2 velc = texture2D(velocity, uv).xy;
    gl_FragColor = vec4(velc + (timestep * force), 0.0, 1.0);
}`;

export {
    AdvectShader,
    BasicShader,
    BoundaryShader,
    DisplayScalarShader,
    DisplayVectorShader,
    DivergenceShader,
    GradientShader,
    JacobiScalarShader,
    JacobiVectorShader,
    SplatShader,
    VorticityShader,
    VorticityForceShader
}