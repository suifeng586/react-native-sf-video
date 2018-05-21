
import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    ImageBackground,
    ScrollView,
    Slider,
    PanResponder,
    Platform,
    Animated
} from "react-native";
import PropTypes from 'prop-types'
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;


const video_play = require('./img/video_play.png');
const video_pause = require('./img/video_pause.png');
const video_full = require('./img/video_full.png');
const video_min = require('./img/video_min.png');
const video_thumb = require('./img/video_thumb.png');

export default class SFVideoViewTool extends Component {


    constructor(props) {
        super(props);
        this.state = {
            paused:false,
            volume:1,
            progress:0,
            curTimer:0,
            maxTimer:0,
            isShow:false,

        }

        this.opacity = new Animated.Value(0);
        this.isOnSlider = false;
    }

    static propTypes = {
        title: PropTypes.string,
        isFull: PropTypes.bool,
        width: PropTypes.object,
        widthValue: PropTypes.number,
        height: PropTypes.object,
        isShow: PropTypes.bool,
        autoPlay: PropTypes.bool,
        barHeight: PropTypes.number,
        hideDuration: PropTypes.number,
        progressColor: PropTypes.string,
        progressMinColor: PropTypes.string,
        videoFullSource:PropTypes.number,
        videoMinSource:PropTypes.number,
        videoPlaySource:PropTypes.number,
        videoPauseSource:PropTypes.number,
        onSlider: PropTypes.func,
        onFullScree: PropTypes.func,
        onMinScree: PropTypes.func,
        onPlay: PropTypes.func,
        onPause: PropTypes.func,

    }
    static defaultProps={

    }
    componentWillMount(){

    }

    componentDidMount(){
        this.setState({
            paused:!this.props.autoPlay,
            isShow:!this.props.autoPlay
        },()=>{
            if (this.state.isShow){
                this.show();
            }
        })

    }
    componentWillUnmount(){
        this.removeTimer();
    }
    removeTimer = () => {
        this.timer && clearTimeout(this.timer);
    }
    recoverAnimate = () => {
        this.removeTimer();
        this.timer = setTimeout(()=>{
            Animated.timing(this.opacity, {
                toValue: 0,
                duration: 300,
            }).start(()=>{
                this.setState({
                    isShow:false
                })
            });
        },this.props.hideDuration);
    }
    replayBegin = () => {
        this.setState({
            isShow:true,
            paused:true
        },()=>{
            this.removeTimer();
            Animated.timing(this.opacity, {
                toValue: 1,
                duration: 300,
            }).start();
        })
    }
    hide = () => {
        this.opacity.setValue(0);
        this.setState({
            isShow:false
        })
    }
    onProgress = (curTime,totalTime) => {
        var value = parseFloat(curTime)/totalTime;
        if (this.isOnSlider){
            this.setState({
                curTimer:curTime,
                maxTimer:totalTime,
            })
        }else{
            this.setState({
                curTimer:curTime,
                maxTimer:totalTime,
                progress:value
            })
        }

    }
    show = () => {
        this.setState({
            isShow:true
        },()=>{
            Animated.timing(this.opacity, {
                toValue: 1,
                duration: 300,
            }).start();
        })
        this.recoverAnimate();
    }
    clickPlay = () => {
        if (this.state.paused){
            this.setState({
                paused:false,
            })
            this.props.onPlay();
            this.recoverAnimate();
        }else{
            this.setState({
                paused:true
            })
            this.props.onPause();
            this.removeTimer();
        }
    }

    clickFull = () => {
        if (this.props.isFull){
            this.props.onMinScree()
        }else{
            this.props.onFullScree()
        }
    }


    onValueChange = (value) =>{
        this.isOnSlider = true;
        this.recoverAnimate();
    }
    onSlidingComplete = (value) =>{
        this.isOnSlider = false;
        var timer = value*this.state.maxTimer/100;
        this.props.onSlider(timer)
        if (this.state.paused == false){
            this.recoverAnimate();
        }

    }
    getTimerStr = (sec) =>{
        var m = Math.floor(sec/60);
        var s = sec%60;
        if (m < 10){
            m = '0' + m;
        }
        if (s < 10){
            s = '0' + s;
        }
        return m + ':' + s;
    }
    render_header = () => {
        var barHeight = this.props.barHeight;
        if (!this.props.title || !this.props.isFull){
            return null;
        }
        return(
                <Text style={{
                    color:'white',
                    fontSize:12,
                    paddingLeft:10,
                    position:'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height:barHeight,
                    flexDirection:'row',
                    alignItems:'center',
                    lineHeight:barHeight,
                    backgroundColor:'transparent',
                }}>{this.props.title}</Text>
        )
    }
    render_bar = () => {
        var barHeight = this.props.barHeight;
        var minSource = this.props.videoMinSource?this.props.videoMinSource:video_min;
        var fullSource = this.props.videoFullSource?this.props.videoFullSource:video_full;
        return(
            <View style={{
                position:'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height:barHeight,
                flexDirection:'row',
                alignItems:'center',
                backgroundColor:'rgba(0,0,0,0.4)',
            }} >
                <Text style={{
                    backgroundColor:'transparent',
                    color:'white',
                    fontSize:12,
                    width:50,
                    textAlign:'center'
                }}>{this.getTimerStr(this.state.curTimer)}</Text>
                <Slider style={{
                    flex:1,
                    height: 10,
                    marginLeft:5,
                    marginRight:5
                }}
                        thumbImage={video_thumb}
                        maximumValue={100}
                        thumbTintColor="white"
                        minimumTrackTintColor={this.props.progressColor}
                        value={this.state.progress*100}
                        onValueChange={this.onValueChange}
                        onSlidingComplete={this.onSlidingComplete}
                />
                <Text style={{
                    backgroundColor:'transparent',
                    color:'white',
                    fontSize:12,
                    width:50,
                    textAlign:'center'
                }}>{this.getTimerStr(this.state.maxTimer)}</Text>
                <TouchableWithoutFeedback onPress={this.clickFull}>
                    <View style={{
                        width:40,
                        height:barHeight,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <Image style={{
                            width:15,
                            height:15,
                        }} source={this.props.isFull?minSource:fullSource}></Image>
                    </View>

                </TouchableWithoutFeedback>
            </View>
        )
    }
    render() {
        if (this.state.isShow){
            var playSource = this.props.videoPlaySource?this.props.videoPlaySource:video_play;
            var pauseSource = this.props.videoPauseSource?this.props.videoPauseSource:video_pause;
            return (
                <Animated.View style={{
                    position:'absolute',
                    left:0,
                    top:0,
                    width:this.props.width,
                    height:this.props.height,
                    alignItems:'center',
                    justifyContent:'center',
                    opacity:this.opacity,
                }}>

                    <TouchableWithoutFeedback onPress={this.clickPlay}>
                        <View style={{
                            width:50,
                            height:50,
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:'rgba(0,0,0,0.5)',
                            borderRadius:25
                        }}>
                            <Image style={{
                                width:24,
                                height:24,
                            }} source={this.state.paused ? playSource : pauseSource}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                    {this.render_bar()}
                    {this.render_header()}
                </Animated.View>
            )
        }else{
            return (
                <Animated.View style={{
                    position:'absolute',
                    left:0,
                    bottom:0,
                    width:this.props.widthValue*this.state.progress,
                    height:1,
                    backgroundColor:this.props.progressMinColor
                }}>

                </Animated.View>
            )
        }

    }
}

