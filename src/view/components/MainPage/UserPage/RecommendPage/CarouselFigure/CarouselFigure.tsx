import React from "react";
import 'antd/dist/antd.css'
import './CarouselFigure.css'
import {CaretLeftOutlined,CaretRightOutlined} from '@ant-design/icons'
import {getBanner} from "../../../../../../apis/recommendPage";
import axios from "axios";

import { Carousel } from 'antd';

interface State{
    imgNums:number,
    carouselL:any,
    carouselC:any,
    carouselR: any,
    carouselButtons:any,
    curIdx:number,
    isSwitchShow:boolean,
    switchLeft:any,
    switchRight:any,
    backLeft:any[],
    backCenter:any[],
    backRight:any[],
    timer:any
}

class CarouselFigure extends React.Component<any, any>{
    state:State={
        imgNums:10,
        carouselL:React.createRef(),
        carouselC:React.createRef(),
        carouselR:React.createRef(),
        carouselButtons:React.createRef(),
        curIdx:0,
        isSwitchShow:false,
        switchLeft:React.createRef(),
        switchRight:React.createRef(),
        backLeft:Array(10),
        backCenter:Array(10),
        backRight:Array(10),
        timer:null
    }

    componentDidMount() {
        //定时切换
        const buttons=this.state.carouselButtons
        buttons.current.children[this.state.curIdx].style.backgroundColor="rgb(201,38,32)"
        const timer=setInterval(()=>{
            this.switchRight()
        },3000)
        this.setState({timer:timer})

        const left=this.state.switchLeft
        const right=this.state.switchRight
        this.setState(()=>({isSwitchShow:false}),
            ()=>{
                left.current.style.display="none"
                right.current.style.display="none"
            })

        getBanner().then(res=> {
            this.setState({imgNums:res.data.banners.length});
            let idx=0
            for(let banner of res.data.banners)
            {
                this.getImgDataUrl(banner.imageUrl,idx)
                idx+=1
            }
        })
    }

    componentWillUnmount() {
        window.clearInterval(this.state.timer)
    }

    async getImgDataUrl(url:string,idx:number){
        const res=await axios.get(url,{responseType:"blob"})
        const dataUrl=URL.createObjectURL(res.data)
        if(idx===this.state.imgNums-2)
        {
            this.state.backLeft[idx]=dataUrl
            this.state.backCenter[idx+1]=dataUrl
            this.state.backRight[0]=dataUrl
        }
        else if(idx===this.state.imgNums-1)
        {
            this.state.backLeft[idx]=dataUrl
            this.state.backCenter[0]=dataUrl
            this.state.backRight[1]=dataUrl
        }
        else
        {
            this.state.backLeft[idx]=dataUrl
            this.state.backCenter[idx+1]=dataUrl
            this.state.backRight[idx+2]=dataUrl
        }
    }

    showSwitch=()=>{
        if(!this.state.isSwitchShow)
        {
            const left=this.state.switchLeft
            const right=this.state.switchRight
            this.setState(()=>({isSwitchShow:true}),
                ()=>{
                    left.current.style.display="flex"
                    right.current.style.display="flex"
                })
        }
    }

    hideSwitch=()=>{
        if(this.state.isSwitchShow)
        {
            const left=this.state.switchLeft
            const right=this.state.switchRight
            this.setState(()=>({isSwitchShow:false}),
                ()=>{
                    left.current.style.display="none"
                    right.current.style.display="none"
                })
        }
    }

    switchLeft=()=>{
        const buttons=this.state.carouselButtons
        buttons.current.children[this.state.curIdx].style.backgroundColor="white"
        this.setState(()=>({curIdx:this.state.curIdx>0?this.state.curIdx-1:9}),
            ()=>{
                buttons.current.children[this.state.curIdx].style.backgroundColor="rgb(201,38,32)"
                this.state.carouselL.current.prev()
                this.state.carouselC.current.prev()
                this.state.carouselR.current.prev()
            })
    }

    switchRight=()=>{
        const buttons=this.state.carouselButtons
        buttons.current.children[this.state.curIdx].style.backgroundColor="white"
        this.setState(()=>({curIdx:this.state.curIdx<(this.state.imgNums-1)?this.state.curIdx+1:0}),
            ()=>{
                buttons.current.children[this.state.curIdx].style.backgroundColor="rgb(201,38,32)"
                this.state.carouselL.current.next()
                this.state.carouselC.current.next()
                this.state.carouselR.current.next()
            })
    }

    render() {
        const buttons=this.state.carouselButtons
        return (
            <div
                onMouseOver={this.showSwitch}
                onMouseOut={this.hideSwitch}
                id="carouselRoot"
            >
                <div id="carouselLeft">
                    <Carousel dots={false} ref={this.state.carouselL}>
                        {
                            this.state.backLeft.map((item)=>(
                                <div style={{position:"relative"}}>
                                    <img src={item} alt="" style={{height:"150px",objectFit:"cover"}}/>
                                </div>
                            ))
                        }
                    </Carousel>
                </div>
                <div id="carouselCenter">
                    <Carousel dots={false} ref={this.state.carouselC}>
                        {
                            this.state.backCenter.map((item)=>(
                                <div><img src={item} alt="" style={{height:"200px",objectFit:"cover"}}/></div>
                            ))
                        }
                    </Carousel>
                </div>
                <div id="carouselRight">
                    <Carousel dots={false} ref={this.state.carouselR}>
                        {
                            this.state.backRight.map((item)=>(
                                <div><img src={item} alt="" style={{height:"150px",objectFit:"cover"}}/></div>
                            ))
                        }
                    </Carousel>
                </div>
                <div id="carouselButtons" ref={this.state.carouselButtons}>
                    {
                        Array(this.state.imgNums).fill(0).map((v,k)=>(
                            <div className="carouselButton"
                                 key={k}
                                 onClick={()=>{
                                     buttons.current.children[this.state.curIdx].style.backgroundColor="white"
                                     this.setState((prevState:any,prevProp:any)=>({curIdx:k}),
                                         ()=>{
                                             buttons.current.children[this.state.curIdx].style.backgroundColor="rgb(201,38,32)"
                                             this.state.carouselL.current.goTo(k)
                                             this.state.carouselC.current.goTo(k)
                                             this.state.carouselR.current.goTo(k)
                                     }
                                     )
                                 }}
                            />
                        ))
                    }
                </div>
                <div id="carouselSwitchLeft" ref={this.state.switchLeft} onClick={this.switchLeft}>{<CaretLeftOutlined/>}</div>
                <div id="carouselSwitchRight" ref={this.state.switchRight} onClick={this.switchRight}>{<CaretRightOutlined/>}</div>
            </div>
        )
    }
}

export default CarouselFigure