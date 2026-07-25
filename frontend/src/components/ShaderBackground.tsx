import { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    syncSize();

    const resizeObserver = new ResizeObserver(() => syncSize());
    resizeObserver.observe(canvas);

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = v_texCoord;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.2;
        
        // Interactive mouse influence
        vec2 m = (u_mouse / u_resolution) * 2.0 - 1.0;
        p += m * 0.15;

        // Flowing waves pattern
        float wave1 = sin(p.x * 2.0 + t) * 0.5 + 0.5;
        float wave2 = sin(p.y * 3.0 - t * 1.5) * 0.5 + 0.5;
        float wave3 = sin(length(p) * 4.0 + t * 2.0) * 0.5 + 0.5;
        
        float pattern = mix(wave1, wave2, 0.5);
        pattern = mix(pattern, wave3, 0.3);
        
        // VeriSphere light palette
        vec3 color1 = vec3(0.31, 0.27, 0.90); // #4F46E5 (Indigo)
        vec3 color2 = vec3(0.38, 0.40, 0.94); // #6366F1 (Secondary)
        vec3 color3 = vec3(0.02, 0.71, 0.83); // #06B6D4 (Cyan)
        vec3 bg = vec3(0.972, 0.980, 0.988);  // #F8FAFC (Light)
        
        vec3 finalColor = mix(bg, color1, pattern * 0.08);
        finalColor = mix(finalColor, color2, wave2 * 0.06);
        finalColor = mix(finalColor, color3, wave3 * 0.04);
        
        float dist = length(p);
        finalColor = mix(finalColor, color1, (1.0 - smoothstep(0.0, 1.5, dist)) * 0.03);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(glContext: WebGLRenderingContext, type: number, src: string) {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, src);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error(glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    const mousePos = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mousePos.x = nx * canvas.width;
        mousePos.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    function render(time: number) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mousePos.x, mousePos.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameId = requestAnimationFrame(render);
    }

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-60 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
