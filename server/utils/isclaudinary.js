export default function isCloudinaryURL(url) {
    const parsedurl=new URL(url)
    return parsedurl.hostname.includes('cloudinary.com')
}
