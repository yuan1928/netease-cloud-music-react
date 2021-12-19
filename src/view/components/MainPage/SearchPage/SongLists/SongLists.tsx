import React from "react";
import {withRouter} from "react-router";
import {getSingers, getSongLists} from "../../../../../apis/searchPage";
import './SongLists.css'
import {PlayCircleOutlined} from "@ant-design/icons";
import {Pagination} from "antd";

interface SongList{
    id:number,
    name:string[],
    size:number,
    creator:string,
    playCount:number,
    coverUrl:string
}

interface State{
    keyword:string,
    page:number,
    resNum:number,
    songLists:SongList[]
}

class SongLists extends React.Component<any, any>{
    state:State={
        keyword:this.props.match.params.keyword,
        page:1,
        resNum:0,
        songLists:[]
    }

    getInfo=()=>{
        this.setState(()=>({songLists:[]}),()=>{
            getSongLists(this.state.keyword,(this.state.page-1)*30).then(res=>{
                const reg=new RegExp(this.state.keyword,"g")
                this.setState({resNum:res.data.result.playlistCount})
                console.log(res);
                for(let songlist of res.data.result.playlists)
                {
                    this.state.songLists.push({
                        id:songlist.id,
                        name:songlist.name.replace(reg,"$#"+this.state.keyword+"#$").split("$"),
                        size:songlist.trackCount,
                        creator:songlist.creator.nickname,
                        playCount:songlist.playCount,
                        coverUrl:songlist.coverImgUrl
                    })
                }
                this.forceUpdate()
            })
        })
    }

    switchPage=(page:number)=>{
        this.setState(()=>({page:page}),()=>{this.getInfo()})
    }

    getSongListDetail=(id:number)=>{
        this.props.history.push("/song-list/"+id)
    }

    componentDidMount() {
        this.getInfo()
    }

    render() {
        return (
            <div style={{width:"100%"}}>
                <span style={{display:"flex",fontSize:'25px',fontWeight:"bolder",padding:"5px"}}>
                    找到{this.state.resNum}张歌单
                </span>
                {
                    this.state.songLists.map((item,idx)=>(
                        <div
                            className={idx%2===0?"searchPageSongListsRowEven":"searchPageSongListsRowOdd"}
                            onClick={()=>{this.getSongListDetail(item.id)}}
                        >
                            <img src={item.coverUrl} style={{width:"50px",objectFit:"cover",borderRadius:"3px",marginRight:"5px"}}/>
                            <div style={{width:"50%",display:"flex",alignItems:"center"}}>
                                {
                                    item.name.map(str=>{
                                        if(str[0]==="#" && str[str.length-1]==="#")
                                        {return <div style={{color:"cornflowerblue"}}>{str.slice(1,str.length-1)}</div>}
                                        else {return <div>{str}</div>}
                                    })
                                }
                            </div>
                            <div style={{color:"rgba(0,0,0,0.4)",width:"10%"}}>
                                {item.size}首
                            </div>
                            <div style={{color:"rgba(0,0,0,0.4)",width:"20%",textAlign:"start"}}>
                                by{"     "+item.creator}
                            </div>
                            <div style={{color:"rgba(0,0,0,0.4)",width:"10%",display:"flex",alignItems:"center"}}>
                                <PlayCircleOutlined/>
                                {Math.floor(item.playCount/10000)>0?String(Math.floor(item.playCount/10000))+"万":item.playCount}
                            </div>
                        </div>
                    ))
                }
                <div style={{width:"100%",display:"flex",justifyContent:"center",margin:"20px 0 20px 0"}}>
                    <Pagination total={this.state.resNum} pageSize={30} onChange={this.switchPage}/>
                </div>
            </div>
        )
    }
}

export default withRouter(SongLists)