import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Container from './Container'
import PlayableContainer from './PlayableContainer'
import findImg from '../utils/findImg'
import sourceIdTypes from '../utils/sourceIdTypes'

import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationSlice'
import { setSid } from '../reducers/infoSlice'

import commandService from '../services/commands'

const Containers = () => {
  const [containers, setContainers] = useState([])
  const [playableContainers, setPlayableContainers] = useState([])
  const [playableContainer, setPlayableContainer] = useState(null)
  const [memoMap, setMemoMap] = useState(new Map())
  const [prevCmds, setPrevCmds] = useState([])

  const info = useSelector(state => state.info)
  const dispatch = useDispatch()

  const handleBrowse = async (command, playCont = null) => {
    
    if (memoMap.has(command))
    {
      const memoizedPayloadObj = memoMap.get(command)
      console.log('memoized result found...', memoizedPayloadObj)

      if (playCont)
      {
        setPlayableContainer(playCont)
        setPlayableContainers(memoizedPayloadObj)
      }
      else
      {
        setContainers(memoizedPayloadObj)
      }

      setPrevCmds(prevStateCmds => prevStateCmds.concat(command))
      return true
    }
    else
    {
      const containerRes = await commandService.sendCommand(command)
      //console.log('containerRes:', containerRes)

      // decode any encoded strings in name
      let payloadObj = containerRes.data.payload
      for ( let obj of payloadObj )
      {
        if ( obj.name )
        {
          obj.name = decodeURIComponent(obj.name)
        }
      }
      //console.log('payloadObj:', payloadObj)
      const heosObj = containerRes.data.heos

      // failure result
      if (heosObj.result === 'fail')
      {
        console.log('fail result:', heosObj.message)
        dispatch(setNotification('Command sent was invalid...'))
        return false
      }
      
      // check if no containers found
      if (payloadObj.length > 0)
      {
        //console.log('cmd to send to back line:', command)
        //console.log('after payloadObj is set:', payloadObj)

        if (playCont)
        {
          //console.log('findImg name:', playCont.name)
          if ( info.plexIp )
          {
            const findImgRes = await findImg(playCont.name, info.plexIp)
            if ( findImgRes && !findImgRes.error )
            {
              playCont.image_url = findImgRes
            }
            else if ( findImgRes.error )
            {
              dispatch(setNotification(findImgRes.error))
            }
            else
            {
              dispatch(setNotification('Failed to find album art!'))
            }
          }
          setPlayableContainer(playCont)
          setPlayableContainers(payloadObj)
        }
        else
        {
          setContainers(payloadObj)
        }
        
        setPrevCmds(prevStateCmds => prevStateCmds.concat(command))
        setMemoMap(prevMemoMap => new Map(prevMemoMap.set(command, payloadObj)))
        return true
      }
      // else, go back to last found group of containers
      else
      {
        dispatch(setNotification('No results found...'))
        return false
      }
    }
  }

  const handleBack = async () => {
    // check if prevCmds exist, have to offset from last saved cmd
    if (prevCmds.length > 1)
    {
      setPlayableContainer(null)
      setPlayableContainers([])

      // save, then pop previous cmd
      const prevCmd = prevCmds[prevCmds.length-2]
      setPrevCmds(prevStateCmds => prevStateCmds.slice(0, prevStateCmds.length-1))

      //console.log('prevCmd:', prevCmd)

      const memoizedPayloadObj = memoMap.get(prevCmd)
      //console.log('found memoized result for back...', memoizedPayloadObj)
      setContainers(memoizedPayloadObj)
    }
    // if at root or only root left, clear containers & prevCmds
    else
    {
      setPrevCmds([])
      setContainers([])
    }
  }

  // modifies command string to prepare next container to display based on if it is a playable/un-playable container
  // also prevents browsing media/playable container since that is deepest container level
  const handleContainerCmds = async (sid, cid = null, container = null) => 
  {
    // at browseable container level
    if (cid) 
    {
      // determine if container exists and is playable
      //console.log('playable container clicked:', container.playable === 'yes')
      return await handleBrowse(`browse/browse?sid=${info.sid}&cid=${cid}`, (container && container.playable === 'yes') ? container : null) 
    }
    // still not at container level
    else if (sid)
    {
      dispatch(setSid(sid))
      return await handleBrowse(`browse/browse?sid=${sid}`)
    }
  }

  // determine if we display queueable media/container or more browsable containers
  const determineContainerType = () => {
    if (playableContainers.length > 0)
    {
      return <PlayableContainer container={playableContainer} items={playableContainers} />
    }
    else
    {
      return (
        <div className='containersList'>
          {containers.map(c => <Container key={(c.cid) ? c.cid : c.sid} item={c} handleContainerCmds={handleContainerCmds}/>)}
        </div>
      )
    }
  }

  return (containers.length > 0)
  ?
    <>
      <div className='backButton'>
        <Button variant='secondary' onClick={handleBack}>back</Button>
      </div>
      { determineContainerType() }
    </>
  :
    // Only allow access to Local USB Media / Local DLNA severs, specifcially Plex
    <Button onClick={() => handleBrowse(`browse/browse?sid=${sourceIdTypes.local}`)}>Browse for local media sources</Button>
}

export default Containers