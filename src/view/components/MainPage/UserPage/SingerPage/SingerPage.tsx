import React from "react";
import {getSingers} from "../../../../../apis/singerPage";
import './singerPage.css'
import {Pagination} from "antd";

interface Button{
    name:string,
    value:string|number
}
interface Singer{
    name:string,
    id:number,
    imgUrl:string
}
interface State{
    areaButtons:Button[]
    typeButtons:Button[],
    initialButtons:Button[],
    curArea:number,
    curType:number,
    curInitial:number|string,
    areaButtonsRef:any,
    typeButtonsRef:any,
    initialButtonsRef:any,
    curPage:number,
    isPageIncrease:boolean,
    curSingers:Singer[],
    curTotal:number
}
class SingerPage extends React.Component<any, any>{
    state:State={
        areaButtons:[{name:"全部",value:-1},{name:"华语",value:7},{name:"欧美",value:96},
                     {name:"日本",value:8},{name:"韩国",value:16},{name:"其他",value:0}],
        typeButtons:[{name:"全部",value:-1},{name:"男歌手",value:1},{name:"女歌手",value:2}, {name:"乐队歌手",value:3}],
        initialButtons:[{name:"热门",value:-1},{name:"#",value:0}],
        curArea:-1,
        curType:-1,
        curInitial:-1,
        areaButtonsRef:React.createRef(),
        typeButtonsRef:React.createRef(),
        initialButtonsRef:React.createRef(),
        curPage:1,
        isPageIncrease:true,
        curSingers:[],
        curTotal:30
    }

    componentDidMount() {
        for(let i=65; i<=90; i++)
        {this.state.initialButtons.push({name:String.fromCharCode(i), value:String.fromCharCode(i+32)})}
        this.getSingersList()
    }

    getSingersList=()=>{
        getSingers(this.state.curType,this.state.curArea,this.state.curInitial,this.state.curPage).then(res=>{
            console.log(res);
            this.setState(()=>({curSingers:[],
                    curTotal:(res.data.more && this.state.isPageIncrease)?this.state.curTotal+30:this.state.curTotal}),
                ()=>{
                for(let singer of res.data.artists)
                {
                    this.state.curSingers.push({
                        name:singer.name,
                        id:singer.id,
                        imgUrl:singer.picUrl
                    })
                }
                this.forceUpdate()
            })
        })
    }

    clickArea=(item:Button,idx:number)=>{
        this.setState(()=>({curArea:item.value,curPage:1,curTotal:30,isPageIncrease:true}),()=>{
            let button
            //console.log(this.state.areaButtonsRef);
            for(let i=0; i<this.state.areaButtonsRef.current.children.length; i++)
            {
                button=this.state.areaButtonsRef.current.children[i]
                if(i===2*idx+1){button.id="singerPageSelectedAreaButton"}
                else {button.id=""}
            }
            this.getSingersList()
        })
    }

    click=(item:Button,idx:number,param:string)=>{
        this.setState(()=>({[param]:item.value,curPage:1,curTotal:30,isPageIncrease:true}),()=>{
            let button
            let children
            let id
            if(param==="curArea")
            {
                children=this.state.areaButtonsRef.current.children
                id="singerPageSelectedAreaButton"
            }
            else if(param==="curType")
            {
                children=this.state.typeButtonsRef.current.children
                id="singerPageSelectedTypeButton"
            }
            else
            {
                children=this.state.initialButtonsRef.current.children
                id="singerPageSelectedInitialButton"
            }
            for(let i=0; i<children.length; i++)
            {
                button=children[i]
                if(i===2*idx+1){button.id=id}
                else {button.id=""}
            }
            this.getSingersList()
        })
    }

    switchPage=(page:number)=>{
        const flag=(page>this.state.curPage)
        this.setState(()=>({curPage:page,isPageIncrease:flag}),()=>{this.getSingersList()})
    }


    render() {
        return (
            <div id="singerPageRoot">
                <div className="singerPageConsole" ref={this.state.areaButtonsRef}>
                    <div className="singerPageButtonTile">语种:</div>
                    {this.state.areaButtons.map((item,idx)=>(
                        idx<this.state.areaButtons.length-1?
                        <>
                            <div
                                className="singerPageButton"
                                id={item.value===this.state.curArea?"singerPageSelectedAreaButton":""}
                                onClick={()=>{this.click(item,idx,"curArea")}}
                            >
                                {item.name}
                            </div>
                            <div className="singerPageButton" style={{color:"lightgray"}}>|</div>
                        </>:
                            <div className="singerPageButton" onClick={()=>{this.click(item,idx,"curArea")}}>{item.name}</div>
                    ))}
                </div>
                <div className="singerPageConsole" ref={this.state.typeButtonsRef}>
                    <div className="singerPageButtonTile">分类:</div>
                    {this.state.typeButtons.map((item,idx)=>(
                        idx<this.state.typeButtons.length-1?
                            <>
                                <div
                                    className="singerPageButton"
                                    id={item.value===this.state.curType?"singerPageSelectedTypeButton":""}
                                    onClick={()=>{this.click(item,idx,"curType")}}
                                >
                                    {item.name}
                                </div>
                                <div className="singerPageButton" style={{color:"lightgray"}}>|</div>
                            </>:
                            <div className="singerPageButton" onClick={()=>{this.click(item,idx,"curType")}}>{item.name}</div>
                    ))}
                </div>
                <div className="singerPageConsole" ref={this.state.initialButtonsRef}>
                    <div className="singerPageButtonTile">筛选:</div>
                    {this.state.initialButtons.map((item,idx)=>(
                        idx<this.state.initialButtons.length-1?
                            <>
                                <div
                                    className="singerPageButtonInitial"
                                    id={item.value===this.state.curInitial?"singerPageSelectedInitialButton":""}
                                    onClick={()=>{this.click(item,idx,"curInitial")}}
                                >
                                    {item.name}
                                </div>
                                <div className="singerPageButtonInitial" style={{color:"lightgray"}}>|</div>
                            </>:
                            <div className="singerPageButtonInitial" onClick={()=>{this.click(item,idx,"curInitial")}}>
                                {item.name}
                            </div>
                    ))}
                </div>
                {
                    this.state.curSingers.map((item)=>(
                        <div style={{width:'20%',padding:"15px 15px 0 0"}}>
                            <img src={item.imgUrl} style={{width:"100%",objectFit:"cover",borderRadius:'3px'}}/>
                            <div>{item.name}</div>
                        </div>
                    ))
                }
                <div style={{width:"100%",margin:"10px 0 20px 0"}}>
                    <Pagination
                        defaultCurrent={1}
                        defaultPageSize={30}
                        total={this.state.curTotal}
                        onChange={(page)=>{this.switchPage(page)}}
                    />
                </div>
            </div>
        )
    }
}

export default SingerPage