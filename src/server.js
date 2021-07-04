const express = require('express')
const {searchForIPs, grabIPs} = require('./search.js')
const { connectToIp, disconnectFromIp, sendCmd, connection  } = require('./connect.js')

const app = express()
app.use(express.json())

const wrapAsync = (callback) => 
{
  return (req, res, next) =>
  {
    callback(req, res, next).catch(next)
  }
}

app.get('/api/grabIPs', wrapAsync(async (req, res) => {
  const ips = await grabIPs()
  console.log('/api/grabIPs ips:', ips)
  if ( ips ) 
  {
    res.json(ips)
  }
}))

app.get('/api/searchIPs', wrapAsync(async (req, res) => {
  const searchForIPsRes = await searchForIPs()
  console.log('/api/searchIPs searchForIPsRes:', searchForIPsRes)
  if ( searchForIPsRes )
  {
    console.log(`/api/searchIPs searchForIPs succeeded? ${searchForIPsRes.success}`)
    res.json(searchForIPsRes)
  }
}))

app.get('/api/connect/:address', wrapAsync(async (req, res) => {
  const connRes = await connectToIp(req.params.address)
  console.log(`/api/connect/${req.params.address} connRes:`, connRes)
  if ( connRes )
  {
    res.json(connRes)
  }
}))

app.get('/api/disconnect', wrapAsync(async (req, res) => {
  const disConRes = await disconnectFromIp()
  if ( disConRes )
  {
    res.json(disConRes)
  }
}))

app.post('/api/send/', wrapAsync(async (req, res) => {
  const sendRes = await sendCmd(req.body.cmd)
  if ( sendRes )
  {
    res.json(sendRes)
  }
}))

const sendEvtData = (data, res) => {
  const dataStr = data.toString()
  console.log('data event:', dataStr)

  const evtMatches = dataStr.match(/{[\s]*"heos": {\n.*command.*event\/[^}]*}\n}[\s]*/g)
  if ( evtMatches )
  {
    for ( const evt of evtMatches )
    {
      res.write(`data: ${JSON.stringify( JSON.parse(evt) )}\n\n`)
    }
  }
}

app.get('/events', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  })

  connection.on('data', data => sendEvtData(data, res))

  req.on('close', () => {
    connection.on('data', () => {})
    console.log('Ended SSE!')
  })
})

app.use((err, req, res, next) => {
  if ( err )
  {
    console.log(err.message, err.stack)
    res.json({error: {
      message: err.message, 
      stack: err.stack
    }})
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`express server running on port ${PORT}`)
})