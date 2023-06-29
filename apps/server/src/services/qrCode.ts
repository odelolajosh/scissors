import QRCode from 'qrcode'

// create QR and store in disk
export const generateQrCode = async (url: string) => {
  try {
    return await QRCode.toDataURL(url)
  } catch (err) {
    console.error(err)
    return null
  }
}