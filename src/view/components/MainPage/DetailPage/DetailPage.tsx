import React from "react";
import {getLyric,getDetail,getSimilarSongs,getComments} from "../../../../apis/detailPage";
import './DetailPage.css'
import {LikeOutlined, ShareAltOutlined, CommentOutlined} from '@ant-design/icons'
import { Divider, Pagination} from 'antd';
import {withRouter} from "react-router";
import {getSongUrl, isSongValid} from "../../../../apis/songListDetailPage";
import {playSingleSong} from "../MainPage";

interface SimilarSong{
    title:string,
    picUrl:string,
    songUrl:string,
    id:number
}
interface Comment{
    user:string,
    avatar:string,
    comment:string,
    time:string,
    likeCount:number,
    replyUser:string,
    replyComment:string
}
interface State{
    curID:number,
    lyrics:string[],
    timePoints:number[],
    curIdx:number,
    songName:string,
    songAlia:string,
    singer:string,
    singerAlia:string,
    picUrl:string,
    similarSongs:SimilarSong[],
    curPage:number,
    commentsNum:number,
    comments:Comment[],
    isUpdate:boolean
}
class DetailPage extends React.Component<any, any>{
   state:State={
       curID:this.props.match.params.id,
       lyrics:[""],
       timePoints:[0],
       curIdx:0,
       songName:"",
       songAlia:"",
       singer:"",
       singerAlia:"",
       picUrl:"",
       similarSongs:[],
       curPage:1,
       commentsNum:0,
       comments:[],
       isUpdate:false
   }

   getLyrics=()=>{
       getLyric(this.state.curID).then(res=>{
           const data=res.data.lrc.lyric.split("\n")
           data.pop()
           for(let lyric of data)
           {
               this.state.lyrics.push(lyric.slice(lyric.search("]")+1))
               this.state.timePoints.push(this.getTimePoints(lyric))
           }
           this.forceUpdate()
       })
   }

   getOtherInfo=()=>{
       getDetail(this.state.curID).then(res=>{
           const data=res.data.songs[0]
           this.setState({
               songName:data.al.name,
               songAlia:(data.alia[0]===undefined)?"":data.alia[0],
               singer:data.ar[0].name,
               singerAlia:(data.ar[0].alias.length)?data.ar[0].alias[0]:"",
               picUrl:data.al.picUrl
           })
       })

       getSimilarSongs(this.state.curID).then(res=>{
           for(let song of res.data.songs)
           {
               this.state.similarSongs.push({
                   title:song.name+((song.alias.length)?("("+song.alias[0]+")"):"")+"-"+song.artists[0].name,
                   picUrl:song.album.picUrl,
                   songUrl:song.mp3Url,
                   id:song.id
               })
           }
       })

       getComments(this.state.curID,this.state.curPage-1).then(res=>{
           this.setState({commentsNum:res.data.total})
           this.getCurComments(res)
       })
   }

    componentDidMount() {
        if(this.state.lyrics.length===1) {this.getLyrics()}
        this.getOtherInfo()
        this.props.playWithLyricsEvent.addListener("updateLyric",(curTime:number)=>{
            let i=0
            while (this.state.timePoints[i]<curTime) {i+=1}
            this.setState({curIdx:i-1})
        })

    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
       if(this.state.isUpdate)
       {
           this.getLyrics()
           this.getOtherInfo()
           this.setState({isUpdate:false})
       }
    }

    getTimePoints=(lyric:string)=>{
        const time=lyric.slice(1,lyric.search("]")).split(":")
        return time.map((v,k)=>(Math.pow(60,time.length-1-k)*Number(v))).reduce((a,b)=>(a+b))
    }

    getCurComments=(res:any)=>{
       this.setState({comments:[]})
        for(let comment of res.data.comments)
        {
            this.state.comments.push(
                {
                    user:comment.user.nickname,
                    avatar:comment.user.avatarUrl,
                    comment:comment.content,
                    time:comment.timeStr,
                    likeCount:comment.likedCount,
                    replyUser:(comment.beReplied.length)?(comment.beReplied[0].user.nickname):" ",
                    replyComment:(comment.beReplied.length)?(comment.beReplied[0].content):" "
                }
            )
        }
    }

    switchPage=(targetPage:number)=>{
       getComments(this.state.curID,(targetPage-1)*10).then(res=>{
           this.getCurComments(res)
           console.log(this.state.comments.length);
           this.forceUpdate()
       })
    }

    play=(id:number)=>{
        isSongValid(id).then(()=>{
            getSongUrl(id).then(res=>{
                playSingleSong.emit("play", id, res.data.data[0].url, "$another-song")
                //this.props.history.push("/detail/"+id+"/$another-song")
                this.setState(()=>({curID:id,isUpdate:true,lyrics:[],similarSongs:[],comments:[]}),()=>{this.forceUpdate()})
            })
        },()=>{alert("没有播放源")})
    }


    render() {
        let curIdx=this.state.curIdx
        let head=Array(4).fill(0).map((v,k)=>{return (curIdx-(4-k)>=0)?this.state.lyrics[curIdx-(4-k)]:""})
        let cur=this.state.lyrics[curIdx]
        let tail=Array(4).fill(0).map((v,k)=>{return (curIdx+(k+1)<this.state.lyrics.length)?this.state.lyrics[curIdx+(k+1)]:""})
        return (
            <div
                style={{width:"100%",overflowY:"scroll",display:"flex",flexWrap:"wrap",justifyContent:"center"}}
                key={this.props.location.key}
            >
                <div id="detailPageMusicInfo">
                    <div id="detailPageMusicImg">
                        <div style={{width:"250px",height:"250px",borderRadius:"50%",backgroundColor:"black"
                                ,display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <img
                                alt=""
                                src={this.state.picUrl}
                                style={{width:"200px",height:"200px",objectFit:"cover",borderRadius:"50%"}}
                            />
                        </div>
                    </div>
                    <div>
                        <div style={{fontSize:"30px"}}>
                            {this.state.songAlia.length?this.state.songName+"("+this.state.songAlia+")":this.state.songName}
                        </div>
                        <div style={{fontSize:"15px",color:"dimgray",marginBottom:'50px'}}>
                            {this.state.singerAlia.length?this.state.singer+'-'+this.state.singerAlia:this.state.singer}
                        </div>
                        <div id="detailPageMusicLyrics">
                            {head.map((item,k) => (<div key={"head"+k} className="detailPageLyricsItem">{item}</div>))}
                            {cur!==undefined?<div className="detailPageLyricCur">{cur}</div>:null}
                            {tail.map((item,k)=> (<div key={"tail"+k} className="detailPageLyricsItem">{item}</div>))}
                        </div>
                    </div>
                    <div style={{width:"20vw",height:"200px",display:"flex",flexDirection:"column", alignItems:"flex-start"}}>
                        <div>播放来源：搜索页</div>
                        <div style={{fontWeight:"bolder",marginTop:"20px"}}>喜欢这首歌的人也喜欢听</div>
                        {
                            this.state.similarSongs.map(item=>(
                                <div
                                    onClick={()=>{this.play(item.id)}}
                                    className="detailPageSimilarSong"
                                >
                                    <img src={item.picUrl} style={{width:"30px",height:"30px",borderRadius:"3px",objectFit:"cover"}}/>
                                    <div style={{marginLeft:"5px"}}>{item.title}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div id="detailPageComments" style={{width:"60%"}}>
                    <div style={{fontWeight:"bolder",fontSize:'20px',display:"flex"}}>
                        全部评论({this.state.commentsNum})
                    </div>
                    <div>
                        {
                            this.state.comments.map((item,k)=>(
                                <div style={{margin:"30px",display:"flex"}}>
                                    <img
                                        src={item.avatar}
                                        alt=""
                                        style={{width:"30px",height:"30px",objectFit:"cover",borderRadius:"50%",margin:"10px"}}
                                    />
                                    <div style={{width:"100%"}}>
                                        <div style={{width:"100%",display:"flex",justifyContent:"flex-start", flexWrap:"wrap",
                                            marginBottom:"6px"}}>
                                            <div style={{color:"cornflowerblue"}}>{item.user}:</div>
                                            <div style={{textAlign:"start"}}>{item.comment}</div>
                                        </div>
                                        {
                                            item.replyUser!==" "?
                                                <div style={{width:"100%",display:"flex", justifyContent:"flex-start",
                                                    flexWrap:"wrap",backgroundColor:"rgba(0,0,0,0.05)",borderRadius:"6px",
                                                    padding:"6px"
                                                }}>
                                                    <div style={{color:"cornflowerblue"}}>@{item.replyUser}:</div>
                                                    <div style={{textAlign:"start"}}>{item.replyComment}</div>
                                                </div>:null
                                        }
                                        <div style={{width:"100%",display:"flex",justifyContent:"space-between",color:"gray",
                                            marginTop:"6px"}}>
                                            <div>{item.time}</div>
                                            <div style={{display:"flex",alignItems:"center"}}>
                                                <LikeOutlined/>
                                                {item.likeCount>0?item.likeCount:null}
                                                <div style={{color:"lightgrey",marginLeft:"5px",marginRight:"5px"}}>|</div>
                                                <ShareAltOutlined />
                                                <div style={{color:"lightgrey",marginLeft:"5px",marginRight:"5px"}}>|</div>
                                                <CommentOutlined />
                                            </div>
                                        </div>
                                        {k!==9? <Divider/>:null}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div style={{width:"100%",margin:"20px"}}>
                    <Pagination
                        total={this.state.commentsNum}
                        defaultPageSize={10}
                        defaultCurrent={1}
                        onChange={this.switchPage}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(DetailPage)