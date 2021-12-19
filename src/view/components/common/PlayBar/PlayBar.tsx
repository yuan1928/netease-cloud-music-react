import React from "react";
import 'antd/dist/antd.css'
import EventEmitter from "events";
import VolumeBar from "./VolumeBar/VolumeBar";
import {Image,Tooltip} from "antd";
import {HeartOutlined,HeartTwoTone,MenuUnfoldOutlined,StepBackwardOutlined,PlayCircleOutlined,StepForwardOutlined,
        MenuOutlined,PauseOutlined,SoundOutlined,AudioMutedOutlined} from '@ant-design/icons'
import {withRouter} from "react-router";

const imgDefault="data:image/png;base64,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"
const Event=new EventEmitter()
const style=require("./PlayBar.css")

interface State{
    cur:SongInfo
    like:boolean
    player:any,
    isPlaying:boolean,
    isPause:boolean,
    progressBG:any,
    progressBar:any,
    curTime:string,
    endTime:string,
    mouseDown:boolean,
    isMute:boolean,
    isShowVolume:boolean,
    input:any,
    musicUrl:string,
    musicID:number,
    isShowingDetail:boolean,
    keyword:string,
    selectedRow:number,
    songListID:number
}
interface SongInfo{
    img:string,
    title:string,
    singer:string,
}
class PlayBar extends React.Component<any, any>{
    state:State={
        cur:{
            img:"../../../../assets/icon.png",
            title:"title",
            singer:"singer"
        },
        like:false,
        player:React.createRef(),
        isPlaying:false,
        isPause:false,
        progressBG:React.createRef(),
        progressBar:React.createRef(),
        curTime:"00:00",
        endTime:"00:00",
        mouseDown:false,
        isMute:false,
        isShowVolume:false,
        input:React.createRef(),
        musicUrl:"",
        //musicUrl:'http://m701.music.126.net/20211209230650/154ee87f8eee38133f3a81c79c6564ae/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/9865019573/86ce/dc40/9037/afbde497140b6aa141281dc2686bc750.mp3',
        musicID:Infinity,
        isShowingDetail:false,
        keyword:"",
        selectedRow:Infinity,
        songListID:Infinity
    }

    componentDidMount() {
        this.state.player.current.focus()
        this.state.progressBar.current.focus()
        this.state.progressBG.current.focus()
        const audio=document.getElementById("audio")
        if(audio)
        {audio.addEventListener("timeupdate",this.updateProgress)}
        Event.addListener("mute",()=>{this.setState({isMute:true})})
        this.props.playMusicEvent.addListener("play", (url:string,id:number,keyword:string,selectedRow:number)=>
            {
                //this.setState({musicUrl:"https://music.163.com/song/media/outer/url?id="+id+".mp3"})
                //axios.get("https://music.163.com/song/media/outer/url?id="+id+".mp3").then(res=>console.log(res))
                this.setState({musicUrl:url,musicID:id,keyword:keyword,selectedRow:selectedRow})
                this.setState({isPause:false})
                this.play()
            })
        this.props.playSongListEvent.addListener("play",(id:number, url:string, songListID:number)=>{
            this.setState({musicUrl:url, musicID:id, keyword:"$", selectedRow:Infinity, isPause:false, songListID:songListID})
            this.play()
        })
        this.props.playSingleSongEvent.addListener("play",(id:number,url:string, path:string)=>{
            this.setState({musicUrl:url, musicID:id, keyword:path, selectedRow:Infinity, isPause:false})
            this.play()
        })
    }

    play=()=>{
        //window.localStorage.setItem("song",URL.createObjectURL(this.state.input.current.files[0]))
        const player:any=this.state.player
        if(!this.state.isPause)
        {player.current.src=this.state.musicUrl}
        this.setState({isPlaying:true,isPause:false})
        player.current.play()
    }

    pause=()=>{
        const player:any=this.state.player
        player.current.pause()
        this.setState({isPlaying:false,isPause:true})
    }

    setTime=(time:number,setCur:boolean)=>{
        let min=Math.floor(time/60)
        let minStr=(min<10)?"0"+min:min
        let sec=Math.floor(time-min*60)
        let secStr=(sec<10)?"0"+sec:sec
        if(setCur){this.setState({curTime:minStr+":"+secStr})}
        else {this.setState({endTime:minStr+":"+secStr})}
    }

    updateProgress=()=>{
        const player=this.state.player
        const bar=this.state.progressBar
        let cur=player.current.currentTime
        bar.current.style.width=(100*cur/player.current.duration)+"%"
        this.setTime(cur,true)
        if(this.state.endTime==="00:00" && !Number.isNaN(player.current.duration))
        {
            this.setTime(player.current.duration,false)
        }
        if(this.state.curTime===this.state.endTime)
        {this.setState({isPlaying:false})}
        //console.log(player.current.duration);

        this.props.playWithLyricsEvent.emit("updateLyric",cur)
    }

    clickProgress=(e:any)=>{
        let start=this.state.progressBG.current.offsetLeft
        let end=this.state.progressBG.current.offsetWidth+start
        let cur=e.clientX
        if(cur>=start && cur<=end)
        {
            const bar=this.state.progressBar
            const player=this.state.player
            let ratio=((cur-start)/(end-start))
            bar.current.width=(100*ratio)+"%"
            let curTime=player.current.duration*ratio
            player.current.currentTime=curTime
            this.setTime(curTime,true)
            if(cur===end)
            {this.setState({isPlaying:false})}
        }
    }

    setMute=(mute:boolean)=>{
        const player=this.state.player
        if(mute)
        {
            player.current.volume=0
            this.setState({isMute:true})
            Event.emit("setVolumeZero")
            console.log("in");
        }
        else
        {
            player.current.volume=0.5
            this.setState({isMute:false})
            Event.emit("setVolumeHalf")
        }
    }

    showDetail=()=>{
        if(!this.state.isShowingDetail)
        {
            this.props.history.push("/detail/"+this.state.musicID+"/"+this.state.keyword)
            this.setState({isShowingDetail:true})
        }
        else
        {
            let keyword=this.state.keyword
            this.setState({isShowingDetail:false})
            if(keyword==="$") this.props.history.push("/song-list/"+this.state.songListID)
            else if(keyword==="$rank")this.props.history.push("/user/rank")
            else if(keyword==="$new-song")this.props.history.push("/user/new-song")
            else if(keyword==="$user" || keyword==="$another-song")this.props.history.push("/user")
            else {this.props.history.push("/search/"+this.state.keyword+"/"+this.state.selectedRow)}
        }
    }

    render() {
        return (
            <div id="playRoot">
                <style ref={style} scoped/>
                <div id='songInfo'>
                    <Image
                        src={this.state.cur.img}
                        width="50px" height="50px"
                        fallback={imgDefault}
                        onClick={this.showDetail}
                    />
                    <div id="titleAndLikeAndSinger">
                        <div id="titleAndLike">
                            <div>{this.state.cur.title}</div>
                            {
                                this.state.like?
                                    <HeartTwoTone twoToneColor="red" onClick={()=>{this.setState({like:!this.state.like})}}/>:
                                    <HeartOutlined onClick={()=>{this.setState({like:!this.state.like})}}/>
                            }
                        </div>
                        <div>{this.state.cur.singer}</div>
                    </div>
                </div>
                <div id="play">
                    <div id="playButtons">
                        <MenuUnfoldOutlined className="playItem"/>
                        <StepBackwardOutlined  className="playItem"/>
                        {
                            this.state.isPlaying?
                                <Tooltip title="暂停">
                                    <PauseOutlined onClick={this.pause}/>
                                </Tooltip> :
                                <Tooltip title="播放">
                                    <PlayCircleOutlined  onClick={()=>this.play()} className="playItem"/>
                                </Tooltip>
                        }
                        <StepForwardOutlined  className="playItem"/>
                        <Tooltip title="打开歌词">
                            <MenuOutlined  className="playItem"/>
                        </Tooltip>
                    </div>
                    <div id="playProgress">
                        <audio ref={this.state.player} id="audio"/>
                        <div id="playSensing"
                             onClick={(e)=>{this.clickProgress(e)}}
                             onMouseDown={()=>{this.setState({mouseDown:true})}}
                             onMouseMove={(e)=>{if(this.state.mouseDown){this.clickProgress(e)}}}
                             onMouseUp={()=>{this.setState({mouseDown:false})}}
                        >
                            {this.state.curTime}
                            <div id="playBG" ref={this.state.progressBG}>
                                <div id="playBar" ref={this.state.progressBar}/>
                                <div id="playThumb"/>
                            </div>
                            {this.state.endTime}
                        </div>
                    </div>
                </div>
                <div
                    id="volume"
                    onClick={()=> {this.setState({isShowVolume:!this.state.isShowVolume})}}
                >
                    {
                        this.state.isMute?
                            <Tooltip title="恢复音量">
                                <AudioMutedOutlined
                                    onClick={(e)=>{this.setMute(false);e.stopPropagation()}}
                                />
                            </Tooltip>
                            :
                            <Tooltip title="静音">
                                <SoundOutlined
                                    onClick={(e)=>{this.setMute(true);e.stopPropagation()}}
                                />
                            </Tooltip>
                    }
                </div>
                {
                    this.state.isShowVolume?
                    <VolumeBar player={this.state.player} event={Event} show={true}/>:
                    <VolumeBar player={this.state.player} event={Event} show={false}/>
                }
                <div id="playSongsList">
                    <Tooltip title="打开歌单">
                        <MenuUnfoldOutlined />
                    </Tooltip>
                </div>
            </div>
        )
    }
}

export default withRouter(PlayBar)
