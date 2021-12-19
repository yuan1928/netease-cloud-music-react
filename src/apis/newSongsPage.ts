import request from "./request";

export function getNewSongs(type:number){
    return request({
        url:'/top/song?type='+type,
        method:"get",
    })
}

export function getNewCDs(area:string,offset:number){
    return request({
        url:'/top/album?limit=30&area='+area+"&offset="+offset,
        method:"get",
    })
}

