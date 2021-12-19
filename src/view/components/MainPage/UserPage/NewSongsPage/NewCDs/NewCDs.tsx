import React from "react";
import {getNewCDs} from "../../../../../../apis/newSongsPage";
import Nav from "../Nav/Nav";
import {UserOutlined} from "@ant-design/icons";
import {getSongUrl, isSongValid} from "../../../../../../apis/songListDetailPage";
import {playSingleSong} from "../../../MainPage";

interface CD{
    id:number,
    name:string,
    alia:string,
    singer:string,
    picUrl:string,
}
interface State{
    curArea:string,
    newCDs:CD[],
    curPage:number,
    curTotal:number
}
const dict=["ALL","ZH","EA","KR","JP"]
class NewCDs extends React.Component<any, any>{
    state:State={
        curArea:"ALL",
        newCDs:[],
        curPage:1,
        curTotal:0
    }

    componentDidMount() {
        this.getCDs()
    }

    getCDs=()=>{
        getNewCDs(this.state.curArea,(this.state.curPage-1)*30).then((res)=>{
            const data=res.data.monthData
            let cur
            let idx=1
            for(let cd in data)
            {
                if(idx>50)break
                cur=data[cd]
                this.state.newCDs.push({
                    id:cur.id,
                    name:cur.name,
                    alia:(cur.alias[0]!==undefined)?cur.alias[0]:"",
                    singer:cur.artist.name,
                    picUrl:cur.picUrl,
                })
                idx+=1
            }
            this.setState(()=>({curTotal:this.state.newCDs.length}),()=>{this.forceUpdate()})
        })
    }

    click=(idx:number)=>{
        this.setState(()=>({curArea:dict[idx],newCDs:[],curPage:1}),()=>{this.getCDs()})
    }

    play=(id:number)=>{
        isSongValid(id).then(()=>{
            getSongUrl(id).then(res=>{
                playSingleSong.emit("play", res.data.data[0].url, this.props.location.pathname)
            })
        },()=>{alert("没有播放源")})
    }

    render() {
        return (
            <div style={{width:"100%",display:"flex",flexWrap:"wrap"}}>
                <Nav click={this.click}/>
                {
                    this.state.newCDs.map(item=>(
                        <div style={{width:"20%",padding:"20px",marginBottom:"30px",display:"flex",justifyContent:"flex-start",
                                     flexWrap:"wrap",position:"relative"}}>
                            <img
                                src={item.picUrl}
                                style={{width:"100%",objectFit:"cover",borderRadius:"3px",marginBottom:"5px",cursor:"pointer"}}
                                onClick={()=>{this.play(item.id)}}
                                alt=""
                            />
                            <div style={{position:"absolute",top:"220px",display:"flex",justifyContent:"flex-start",flexWrap:"wrap"}}>
                                {item.name}
                                {item.alia.length?
                                    <div style={{color:"rgba(0,0,0,0.3)",textJustify:"initial"}}>({item.alia})</div>: null}
                            </div>
                            <div style={{position:"absolute",top:"25px",right:"25px",color:"white"}}>
                                <UserOutlined/>
                                {item.singer}
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default NewCDs