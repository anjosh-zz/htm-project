function isItDark (imageSelector) {
  if (!imageSelector) {
    return Promise.resolve()
  }
  let fuzzy = 0.1
  let img = document.querySelector(imageSelector)

  return new Promise((resolve) => {
    img.onload = function () {
      // create canvas
      let canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height

      let ctx = canvas.getContext('2d')
      ctx.drawImage(this, 0, 0)

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let data = imageData.data
      let r, g, b, maxRGB
      let light = 0
      let dark = 0

      for (let x = 0, len = data.length; x < len; x += 4) {
        r = data[x]
        g = data[x + 1]
        b = data[x + 2]

        maxRGB = Math.max(Math.max(r, g), b)
        if (maxRGB < 128) { dark++ } else { light++ }
      }

      let dlDiff = ((light - dark) / (this.width * this.height))

      let isDark = dlDiff + fuzzy < 0
      resolve(isDark)
    }
  })
}

export default isItDark
