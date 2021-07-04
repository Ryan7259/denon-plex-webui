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
            return Promise.resolve(`${plexIp}${thumbLink}`)
        }
        else
        {
            console.log('Failed to find image!')
            console.log('containerName:', containerName)
            console.log('encodedContentName:', encodedContentName)
        }
    }
    catch(error)
    {
        console.log('Error finding image:', error)
        return Promise.reject({error})
    }
  }

  export default findImg