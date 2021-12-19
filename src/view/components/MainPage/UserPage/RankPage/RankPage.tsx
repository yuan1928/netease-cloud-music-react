import React from "react";
import {getOfficialRanks,getRankInfo} from "../../../../../apis/rankPage";
import OfficialRankList from "./OfficialRankList/OfficialRankList";
import ShowFramI from "../../../common/ShowFramI/ShowFramI";
import './RankPage.css'

interface Song{
    title:string,
    alias:string,
    singer:string,
    id:number
}
interface Official{
    name:string,
    id:number,
    cover:string,
    songs:Song[]
}
interface Global{
    title:string,
    id:number,
    imgUrl:string,
    description:string,
    playCount:number
}

interface State{
    officialRankID:number[],
    globalRankID:number[],
    officialRank:Official[],
    globalRank:Global[]
}
class RankPage extends React.Component<any, any>{
    state:State={
        officialRankID:[],
        globalRankID:[],
        officialRank:[],
        globalRank:[]
    }
    componentDidMount() {
        getOfficialRanks().then(res=>{
            let cur
            for(let rank of res.data.list)
            {
                cur=rank.name
                if(cur==="飙升榜" || cur==="新歌榜" || cur==="原创榜" || cur==="热歌榜")
                {this.state.officialRankID.push(rank.id)}
                else
                {this.state.globalRankID.push(rank.id)}
            }
        }).then(()=>{
            //console.log(this.state.rankID);
            Promise.all(this.state.officialRankID.map(id=>(this.getOfficialRank(id))))
                   .then(()=>{
                       Promise.all(this.state.globalRankID.map(id=>(this.getGlobalRank(id))))
                              .then(()=> {this.forceUpdate()})
                   })

        })
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {

    }

    getOfficialRank=(id:number)=>{
        return getRankInfo(id).then(res=>{
            this.state.officialRank.push({
                name:res.data.playlist.name,
                id:res.data.playlist.id,
                cover:res.data.playlist.coverImgUrl,
                songs:res.data.playlist.tracks.slice(0,5).map((item:any)=>({
                    title:item.name,
                    alias:(item.alia[0]!==undefined)?item.alia[0]:"",
                    singer:item.ar[0].name,
                    id:item.id//不确定是item.id还是item.al.id
                }))
            })
        })
    }

    getGlobalRank=(id:number)=>{
        return getRankInfo(id).then(res=>{
            const data=res.data.playlist
            this.state.globalRank.push({
                title:data.name,
                id:data.id,
                imgUrl:data.coverImgUrl,
                description:data.description,
                playCount:data.playCount
            })
        })
    }


    render() {
        return (
            <div
                style={{width:"100%", height:"80vh", display:"flex",flexWrap:"wrap",
                    justifyContent:"center",position:"relative",overflowY:"scroll",padding:'20px'}}>

                <div  style={{fontSize:"20px", fontWeight:"bolder", width:"100%", display:"flex"}}>官方榜</div>

                {this.state.officialRank.map(item=>(
                    <div style={{width:"100%",margin:"20px 0 20px 0"}}>
                        <OfficialRankList rank={item}/>
                    </div>
                ))}

                <div  style={{fontSize:"20px", fontWeight:"bolder", width:"100%", display:"flex"}}>全球榜</div>

                <div style={{width:"100%", display:"flex", flexWrap:"wrap"}}>
                    {this.state.globalRank.map(item=>(
                        <div className="rankListPageSongListItem">
                            <ShowFramI
                                item={item}
                                titlePos="220px"
                            />
                        </div>
                    ))}
                </div>


            </div>
        )
    }
}

export default RankPage