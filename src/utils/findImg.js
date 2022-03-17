import { fetch } from "@tauri-apps/api/http"

const findImg = async (containerName, clientIP) => {
    try
    {
        // encode special chars for HTTP request, also need to remove year suffix to find album properly
        //[\s\S]+-\s
        const encodedContentName = encodeURIComponent(decodeURIComponent(containerName).replace(/[\s\S]+-\s/, '').replace(/\s(\(\d{4}\))$/, ''))
        const findImgRes = await fetch(`${clientIP}/search?query=${encodedContentName}`, {
            method: 'GET',
        })

        if ( findImgRes.data.MediaContainer.Metadata[0] )
        {
            //console.log('findImgRes:',  findImgRes.data.MediaContainer.Metadata[0].thumb)
            const thumbLink = findImgRes.data.MediaContainer.Metadata[0].thumb
            //console.log(`${clientIP}${thumbLink}`)
            return `${clientIP}${thumbLink}`
        }

        return(
            {
                error: {
                    message: 'Failed getting album art!',
                    containerName,
                    encodedContentName
                }
            }
        )
    }
    catch(error)
    {
        console.log('findImg caught error:', error)
        return {error: 'Failed getting album art!'}
    }
  }

  export default findImg