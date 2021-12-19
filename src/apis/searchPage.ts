import request from "./request";

export function getSingles(keyword:string,offset:number){
    return request({
        url:"/search?limit=100&keywords="+keyword+"&offset="+offset,
        method:"get"
    })
}

export function getAlbums(keyword:string,offset:number){
    return request({
        url:"/search?type=10&keywords="+keyword+"&offset="+offset,
        method:"get"
    })
}

export function getSingers(keyword:string,offset:number){
    return request({
        url:"/search?type=100&keywords="+keyword+"&offset="+offset,
        method:"get"
    })
}

export function getVideos(keyword:string,offset:number){
    return request({
        url:"/search?limit=40&type=1014&keywords="+keyword+"&offset="+offset,
        method:"get"
    })
}

export function getSongLists(keyword:string,offset:number){
    return request({
        url:"/search?limit=40&type=1000&keywords="+keyword+"&offset="+offset,
        method:"get"
    })
}

export function getUsers(keyword:string,offset:number){
    return request({
        url:"/search?limit=30&type=1002&keywords="+keyword+"&offset="+offset,
        method:"get"
    })
}

export function getSongUrl(id:number){
    return request({
        url:"/song/url?id="+id,
        method:"get"
    })
}