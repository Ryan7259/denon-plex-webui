import axios from 'axios'

const findImg = async (containerName, plexIp) => {
    try
    {
        // encode special chars for HTTP request, also need to remove year suffix to find album properly
        //[\s\S]+-\s
        const encodedContentName = encodeURIComponent(decodeURIComponent(containerName).replace(/[\s\S]+-\s/, '').replace(/\s(\(\d{4}\))$/, '').replace(/(\s&\s)+/, ' + '))
        const findImgRes = await axios({
            method: 'get',
            url: `/search?query=${encodedContentName}`,
            baseURL: plexIp,
        })

        if ( findImgRes && findImgRes.data.MediaContainer.Metadata[0] )
        {
            //console.log('findImgRes:',  findImgRes.data.MediaContainer.Metadata[0].thumb)
            const thumbLink = findImgRes.data.MediaContainer.Metadata[0].thumb
            //console.log(`${plexIp}${thumbLink}`)
            return `${plexIp}${thumbLink}`
        }

        console.log(
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
        if ( error.response.status === 401 )
        {
            return {error: 'Failed getting album art! Your IP needs to be allowed without auth on the Plex Media Server.'}
        }
        else
        {
            return {error: 'Failed getting album art! Plex Media Server may be down.'}
        }
    }
  }

  export default findImg