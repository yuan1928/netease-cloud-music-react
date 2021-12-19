import request from "./request";

export function getSongListDetailInfo(id:number){
    return request({
        url:"/playlist/detail?id="+id,
        method:"get",
    })
}

export function getSongIDs(id:number){
    return request({
        url:"/playlist/track/all?id="+id,
        method:"get",
    })
}

export function getSong(id:number){
    return request({
        url:"/song/detail?ids="+id,
        method:"get"
    })
}

export function getComments(id:number,offset:number){
    return request({
        url:"/comment/playlist?limit=10&id="+id+"&offset="+offset,
        method:"get"
    })
}

export function isSongValid(id:number){
    return request({
        url:"/check/music?id="+id,
        method:"get"
    })
}

export function getSongUrl(id:number){
    return request({
        url:"/song/url?id="+id,
        method:"get"
    })
}

