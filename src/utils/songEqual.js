// used to not have to update selector state for current item since player sends events too often sometimes for non-changes
const songEqual = (l, r) => {
    return (( l && r ) && (l.qid && r.qid) && (l.qid === r.qid) && (l.mid && r.mid) && (l.mid === r.mid))
}

export default songEqual