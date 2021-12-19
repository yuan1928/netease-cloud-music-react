import request from "./request";

export function getLyric(id:number){
    return request({
        url:"/lyric?id="+id,
        method:"get",
    })
}

export function getDetail(id:number){
    return request(
        {
            url:"/song/detail?ids="+id,
            method:'get'
        }
    )
}

export function getSimilarSongs(id:number){
    return request(
        {
            url:"/simi/song?id="+id,
            method:'get'
        }
    )
}

export function getComments(id:number,offset:number){
    return request(
        {
            url:"/comment/music?limit=10&id="+id+"&offset="+offset,
            method:'get'
        }
    )
}
