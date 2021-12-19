import React from "react";
import 'antd/dist/antd.css'
import './Broadcast.css'
import ShowFramI from "../../../../common/ShowFramI/ShowFramI";
import {RightOutlined} from "@ant-design/icons";
import {getPersonalBroadcast} from "../../../../../../apis/recommendPage";

interface Song{
    imgUrl:string,
    title:string,
    id:number,
}
interface Style{
    songsInfo:Song[],
    isRequest:boolean
}
class Broadcast extends React.Component<any, any>{
    state:Style={
        songsInfo:[],
        isRequest:false
    }
    componentDidMount() {
        if(!this.state.isRequest)
        {
            getPersonalBroadcast().then(res=>{
                for(let item of res.data.result)
                {
                    this.state.songsInfo.push({
                        imgUrl:item.picUrl,
                        title:item.name,
                        id:item.id
                    })
                }
                return new Promise((resolve)=>{resolve("")})
            }).then(res=>{this.forceUpdate();this.setState({isRequest:true})})
        }
    }
    render() {
        return (
            <div id="BroadcastRoot">
                <span style={{width:"90%",marginLeft:"10%",fontSize:"20px",fontWeight:"bolder",display:"flex",alignItems:"center"}}>
                    独家放送<RightOutlined/>
                </span>
                <div style={{width:"80%",marginLeft:"10%",display:"flex",flexWrap:"wrap",justifyContent:"space-evenly"}}>
                    {
                        this.state.songsInfo.map(item=>(
                            <ShowFramI className="broadcastContainer" item={item} titlePos="130px" key={item.id}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Broadcast