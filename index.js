const { chromium } = require('playwright')

const shops = [
  {
    vendor: 'Lider',
    description: 'Consola PS5+ Juego Spider Man',
    url: 'https://www.lider.cl/catalogo/product/sku/1000000000359',
    checkStock: async ({ page }) => {
      const content = await page.textContent('.add-to-cart')
      return content.includes('Agotado') === false
    }
  },
  {
    vendor: 'Lider',
    description: 'Consola PS5',
    url: 'https://www.lider.cl/catalogo/product/sku/1086920',
    checkStock: async ({ page }) => {
      const content = await page.textContent('.add-to-cart')
      return content.includes('Agotado') === false
    }
  },
  {
    vendor: 'Falabella',
    description: 'PlayStation 5',
    url: 'https://www.falabella.com/falabella-cl/product/14483343/PlayStation-5/14483343',
    checkStock: async ({ page }) => {
      try {
        await page.waitForSelector('#buttonForCustomers', { timeout: 5000 })
        return true
      } catch (error) {
        return false
      }
    }
  },
  {
    vendor: 'Hites',
    description: 'PlayStation 5',
    url: 'https://www.hites.com/consola-sony-playstation-5-837800001.html',
    checkStock: async ({ page }) => {
      try {
        await page.waitForSelector('.product-actions', { timeout: 5000 })
        return true
      } catch (error) {
        return false
      }
    }
  },
  {
    vendor: 'Pc Factory',
    description: 'Xbox Series X',
    url: 'https://www.pcfactory.cl/producto/41903-asus-notebook-gamer-tuf-dash-f15-intel-i7-11370h-nvidia-rtx-3050-4gb-15-6-fhd-8gb-ram-512gb-ssd-windows-10-fx516pc-hn021t-grey-metal',
    checkStock: async ({ page }) => {
      try {
        // const content = await page.textContent(
        //   '.product-single__availability-item'
        // )
        // return content.includes('0') === false

        const content = await page.textContent('.product-single__availability-item', { timeout: 5000 })

        const stock = parseInt(content.replace(/\s/g, '').slice(8))

        return stock > 0
      } catch (error) {
        return false
      }
    }
  }
]

;(async () => {
  const browser = await chromium.launch()

  for (const shop of shops) {
    const { checkStock, vendor, url, description } = shop

    const page = await browser.newPage()
    await page.goto(url)

    const hasStock = await checkStock({ page })
    console.log(
      `${vendor}: ${description} => ${
        hasStock ? 'Has Stock!!!' : 'Out of Stock '
      }`
    )
  }

  await browser.close()
})()
