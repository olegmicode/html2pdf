//   /* <script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>
// 	<script src='../../dist/jspdf.debug.js'></script> */
//   import
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export function downloadHtmlToPDF() {
  try {
    console.log('[downloadHtmlToPDF] clicked')
    // const source = window.document.getElementById('mainSection')
    const element = document.body
    const opt = {
      margin: [5, 10],
      filename: 'HtmlToPDF.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode: 'avoid-all',
        before: ['#compliance-report', '#full-gratuity-coverage']
      }
    }
    // New Promise-based usage:
    window.html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.log(error)
  } finally {
    console.log('[downloadHtmlToPDF] finished')
  }
}

export function downloadHtmlToCanvasPDF() {
  try {
    console.log('[downloadHtmlToCanvasPDF] clicked')
    const container = document.body

    html2canvas(container).then(function (canvas) {
      let doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4'
      })
      doc.width = doc.internal.pageSize.width
      doc.height = doc.internal.pageSize.height
      doc.margin = {
        horiz: 15,
        vert: 20
      }
      doc.work = {
        width: doc.width - doc.margin.horiz * 2,
        height: doc.height - doc.margin.vert * 2
      }

      let data = {
        width: container.offsetWidth,
        height: container.offsetHeight,
        ctx: canvas.getContext('2d'),
        page: {}
      }
      data.page.width = data.width
      data.page.height = (data.width * doc.work.height) / doc.work.width

      const getData = function (imgData, width, height) {
        let oCanvas = document.createElement('canvas')
        oCanvas.width = width
        oCanvas.height = height
        let oCtx = oCanvas.getContext('2d')
        oCtx.putImageData(imgData, 0, 0)
        return oCanvas.toDataURL('image/png')
      }

      /**/
      let oImgData = null
      let dataURL = null
      let pages = Math.ceil(data.height / data.page.height)
      for (let i = 0; i < pages; i++) {
        if (i != 0) {
          doc.addPage()
        }
        oImgData = data.ctx.getImageData(
          0,
          data.page.height * i,
          data.page.width,
          data.page.height
        )
        dataURL = getData(oImgData, data.page.width, data.page.height)
        doc.addImage(
          dataURL,
          'jpg',
          doc.margin.horiz,
          doc.margin.vert,
          doc.work.width,
          doc.work.height
        )
      }
      /**/
      doc.save('HtmlToCanvasPDF.pdf')
    })
  } catch (error) {
    console.log(error)
  } finally {
    console.log('[downloadHtmlToCanvasPDF] finished')
  }
}
window.downloadHtmlToCanvasPDF = downloadHtmlToCanvasPDF
window.downloadHtmlToPDF = downloadHtmlToPDF
