let cfg = {
  maxIterations: 250,
  xBounds: [-2.5, 2.5],
  yBounds: [-1, 1],
  // zoom: 1506043553756,
  // center: { x: -0.7746806106269039, y: -0.1374168856043 },
  zoom: 1,
  center: {
    x: 0,
    y: 0,
  },
}

function mbEscapeTime(c) {
  let z = math.complex(0, 0)
  let iteration = 0
  do {
    z = math.add(math.square(z), c)
    iteration++
  } while (z.re + z.im <= 4 && iteration < cfg.maxIterations)

  return {
    its: iteration,
    c: c,
  }
}

function plot() {
  const startTime = dayjs()
  console.log('Plot started at ', startTime.format('H:mm:ss:SSS'))

  const plotWidth = window.innerWidth
  // const plotHeight = plotWidth / ((cfg.xBounds[1] - cfg.xBounds[0]) / 2)
  const plotHeight = window.innerHeight
  const ctx = document.getElementById('plot').getContext('2d')
  ctx.canvas.width = plotWidth
  ctx.canvas.height = plotHeight

  const scale = (cfg.xBounds[1] - cfg.xBounds[0]) / cfg.zoom / plotWidth

  for (let i = 0; i < plotWidth; i++) {
    for (let j = 0; j < plotHeight; j++) {
      const result = mbEscapeTime(
        math.complex(
          i * scale + cfg.xBounds[0] / cfg.zoom + cfg.center.x,
          j * scale + cfg.yBounds[0] / cfg.zoom + cfg.center.y
        )
      )

      ctx.fillStyle =
        result.its === cfg.maxIterations
          ? '#000'
          : `hsl(${result.its % 100}, ${100 - (result.its % 100)}%, ${
              100 - (result.its % 100)
            }%)`
      ctx.fillRect(i, j, 1, 1)
      // ctx.fillRect(i, plotHeight - j, 1, 1)
    }
  }
  const endTime = dayjs()
  console.log('Plot finished in ', endTime.diff(startTime, 's', true))
}

function plotGl() {
  const startTime = dayjs()
  console.log('Plot started at ', startTime.format('H:mm:ss:SSS'))

  const plotWidth = window.innerWidth
  const plotHeight = window.innerHeight

  let app = new PIXI.Application({ width: 600, height: 600 })
  document.body.appendChild(app.view)

  const scale = (cfg.xBounds[1] - cfg.xBounds[0]) / cfg.zoom / plotWidth

  for (let i = 0; i < plotWidth; i++) {
    for (let j = 0; j < plotHeight; j++) {
      const result = mbEscapeTime(
        math.complex(
          i * scale + cfg.xBounds[0] / cfg.zoom + cfg.center.x,
          j * scale + cfg.yBounds[0] / cfg.zoom + cfg.center.y
        )
      )
      let point = new PIXI.Graphics()
      point.beginFill(result.its === cfg.maxIterations ? 0x000000 : 0xffffff)
      point.drawRect(i, j, 1, 1)
      point.endFill()
      app.stage.addChild(point)
      // ctx.fillStyle =
      //   result.its === cfg.maxIterations
      //     ? '#000'
      //     : `hsl(${result.its % 100}, ${100 - (result.its % 100)}%, ${
      //         100 - (result.its % 100)
      //       }%)`
      // ctx.fillRect(i, j, 1, 1)
    }
  }
  const endTime = dayjs()
  console.log('Plot finished in ', endTime.diff(startTime, 's', true))
}

function startPlot() {
  document.getElementById('startBtn').innerHTML = 'Plotting$hellip;'
  document.getElementById('splash').style.height = '0'
  plot()
}
