import React from "react";
import 'antd/dist/antd.css'
import './MV.css'
import ShowFramI from "../../../../common/ShowFramI/ShowFramI";
import {RightOutlined} from "@ant-design/icons";
import {getMV} from "../../../../../../apis/recommendPage";

interface Song{
    imgUrl:string,
    title:string,
    id:number,
}
interface Style{
    songsInfo:Song[],
    isRequest:boolean
}
class MV extends React.Component<any, any>{
    state:Style={
        songsInfo:[],
        isRequest:false
    }
    componentDidMount() {
        if(!this.state.isRequest)
        {
            getMV().then(res=>{
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
            <div id="MVRoot">
                <span style={{width:"90%",marginLeft:"10%",fontSize:"20px",fontWeight:"bolder",display:"flex",alignItems:"center"}}>
                    推荐MV<RightOutlined/>
                </span>
                <div style={{width:"80%",marginLeft:"10%",display:"flex",flexWrap:"wrap",justifyContent:"space-evenly"}}>
                    {
                        this.state.songsInfo.map(item=>(
                            <ShowFramI className="mvContainer" item={item} titlePos="250px" key={item.id}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default MV