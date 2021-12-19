import React from "react";
import CarouselFigure from "./CarouselFigure/CarouselFigure";
import RecommendSongsList from "./RecommendSongsList/RecommendSongsList";
import Broadcast from "./SpetialBroadcast/Broadcast";
import MV from './MV/MV'
import NewMusic from "./NewMusic/NewMusic";


class RecommendPage extends React.Component<any, any>{
    componentDidMount() {
    }

    render() {
        return (
            <div style={{position:"relative",height:"80vh",marginTop:"5px",display:"flex",flexWrap:"wrap",overflow:"scroll"}}>
                <CarouselFigure/>
                <RecommendSongsList/>
                <Broadcast/>
                <NewMusic/>
                <MV/>
            </div>
        )
    }
}

export default RecommendPage