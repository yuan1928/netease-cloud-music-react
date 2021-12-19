import React from "react";

const style=require('./VolumeBar.css')

interface State{
    volumeBar:any
    volumeSensing:any,
    mouseDown:boolean
}
class VolumeBar extends React.Component<any, any>{
    state:State={
        volumeBar:React.createRef(),
        volumeSensing:React.createRef(),
        mouseDown:false
    }

    componentDidMount() {
        this.state.volumeBar.current.focus()
        this.state.volumeSensing.current.focus()
        const bar=this.state.volumeBar
        this.props.event.addListener("setVolumeZero",()=>{bar.current.style.height=0;})
        this.props.event.addListener("setVolumeHalf",()=>{bar.current.style.height='50%'})
        this.props.event.setMaxListeners(Infinity)
    }

    click=(e:any)=>{
        let cur=document.body.clientHeight-e.clientY-5-50
        if(cur>=0 && cur<=90)
        {
            const ratio=cur/90
            const bar=this.state.volumeBar
            bar.current.style.height=100*ratio+"%"
            this.props.player.current.volume=ratio
        }
        if(cur===0)
        {this.props.event.emit("mute")}
    }

    render() {
        return (
            <div id="volumeSensing"
                 onClick={(e)=>{this.click(e)}}
                 onMouseDown={()=>{this.setState({mouseDown:true})}}
                 onMouseUp={()=>{this.setState({mouseDown:false})}}
                 onMouseMove={(e)=>{if(this.state.mouseDown){this.click(e)}}}
                 ref={this.state.volumeSensing}
                 style={{display:this.props.show?"flex":"none"}}
            >
                <style ref={style} scoped/>
                <div id="volumeBG" >
                    <div  id="volumeThumb"/>
                    <div id="volumeBar" ref={this.state.volumeBar}/>
                </div>
            </div>
        )
    }
}

export default VolumeBar