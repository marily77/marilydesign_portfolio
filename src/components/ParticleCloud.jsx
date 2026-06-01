import { useEffect, useRef } from 'react'

function ParticleCloud() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Mobiilis ei käivita animatsiooni üldse
    if (window.innerWidth <= 768) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const setSize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    setSize()

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    const N = 180
    const pts = []

    for (let i = 0; i < N; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() < 0.6
        ? 80 + Math.random() * 160
        : 40 + Math.random() * 280
      pts.push({
        ox: W * 0.5 + Math.cos(angle) * radius,
        oy: H * 0.5 + Math.sin(angle) * radius,
        x: 0, y: 0,
        r: 0.8 + Math.random() * 2.2,
        a: 0.3 + Math.random() * 0.7,
        accent: Math.random() < 0.25,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      })
    }

    let t = 0
    let animId

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.008

      pts.forEach(p => {
        p.x = p.ox + Math.sin(t * p.speed + p.phase) * 12
        p.y = p.oy + Math.cos(t * p.speed * 0.7 + p.phase) * 8
      })

      pts.forEach((p, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 55) {
            const alpha = (1 - dist / 55) * 0.18
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = (p.accent || q.accent)
              ? `rgba(232,255,107,${alpha})`
              : `rgba(240,236,228,${alpha * 0.5})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      pts.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.accent
          ? `rgba(232,255,107,${p.a})`
          : `rgba(240,236,228,${p.a * 0.6})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'absolute',
        top: 0,
        right: '-25%',
        width: '100%',
        height: '85vh',
        opacity: 0.9,
        pointerEvents: 'none'
      }}
    />
  )
}

export default ParticleCloud