const convertTime = (ms) => {
    const totalSecs = parseInt(ms/1000)
    const totalMins = parseInt(totalSecs/60)
    const secsLeft = totalSecs % 60
    
    return `${totalMins}:${secsLeft >= 10 ? secsLeft : `0${secsLeft}`}`
}

export default convertTime