
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
    Animated,
    StatusBar
} from "react-native";
import PropTypes from 'prop-types';
import SFVideoViewTool from "./SFVideoViewTool"
import SFVideoViewPrompt from "./SFVideoViewPrompt"
import SFVideoViewConfig from "./SFVideoViewConfig"
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;

import Video from 'react-native-video';
import SFNet from 'react-native-sf-net';
import Orientation from './SFVideoViewOrientation'

const aniDuration = 200;
export default class SFVideoView extends Component {


    constructor(props) {
        super(props);
        this.state = {
            paused:false,
            volume:1,
            isReloaded:false,
            isFull:false,
            widthValue:0,
            isHideStatusBar:false
        }
        this.isFirst = true;
        this.isNoWifi = false;
        this.isLoadFinish = false;
        this.width = new Animated.Value(0);
        this.height = new Animated.Value(0);
        this.rotate = new Animated.Value(0);
        this.posX = new Animated.Value(0);
        this.posY = new Animated.Value(0);
        this.curOrientation = Orientation.TOP;
    }

    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        title: PropTypes.string,
        allOrientation: PropTypes.bool,
        autoPlay: PropTypes.bool,
        resizeMode: PropTypes.oneOf(['content', 'cover','stretch']),
        width: PropTypes.number,
        height: PropTypes.number,
        left: PropTypes.number,
        top: PropTypes.number,
        barHeight: PropTypes.number,
        hideDuration: PropTypes.number,
        progressColor: PropTypes.string,
        progressMinColor: PropTypes.string,
        containerBackgroundColor: PropTypes.string,
        videoSize: PropTypes.number,
        videoFullSource:PropTypes.number,
        videoMinSource:PropTypes.number,
        videoPlaySource:PropTypes.number,
        videoPauseSource:PropTypes.number,
        onFullScreen: PropTypes.func,
        onMinScreen: PropTypes.func,
        onEnd: PropTypes.func

    }
    static defaultProps={
        autoPlay:true,
        allOrientation:false,
        resizeMode:'cover',
        left:0,
        top:0,
        width:dw,
        height:dh,
        barHeight:35,
        hideDuration:3000,
        progressColor:'white',
        progressMinColor:'rgba(241,90,36,1.0)',
        containerBackgroundColor:'black'
    }
    rotateTo = (x,y,w,h,rotate,animated) => {
        if (animated){
            Animated.parallel([
                Animated.timing(this.width, {
                    toValue: w,
                    duration: aniDuration,
                }),
                Animated.timing(this.height, {
                    toValue: h,
                    duration: aniDuration,
                }),
                Animated.timing(this.posX, {
                    toValue: x,
                    duration: aniDuration,
                }),
                Animated.timing(this.posY, {
                    toValue: y,
                    duration: aniDuration,
                }),
                Animated.timing(this.rotate, {
                    toValue: rotate,
                    duration: aniDuration,
                })
            ]).start();
        }else{
            this.width.setValue(w);
            this.height.setValue(h);
            this.posX.setValue(x);
            this.posY.setValue(y);
            this.rotate.setValue(rotate);
        }

    }
    rotateToLeft = (animated = true) => {
        if (this.props.allOrientation){
            this.rotateTo(-this.props.left,-this.props.top,dw>dh?dw:dh,dw>dh?dh:dw,0,animated);
        }else{
            this.rotateTo((dw-dh)/2-this.props.left,(dh-dw)/2-this.props.top,dh,dw,90,animated);
        }
        this.setState({isFull:true,isHideStatusBar:true});
        if (this.props.onFullScreen){
            this.props.onFullScreen();
        }

    }
    rotateToRight = (animated = true) => {
        if (this.props.allOrientation){
            this.rotateTo(-this.props.left,-this.props.top,dw>dh?dw:dh,dw>dh?dh:dw,0,animated);
        }else {
            this.rotateTo((dw - dh) / 2 - this.props.left, (dh - dw) / 2 - this.props.top, dh, dw, -90,animated);
        }
        this.setState({isFull:true,isHideStatusBar:true});
        if (this.props.onFullScreen){
            this.props.onFullScreen();
        }
    }
    rotateToTop = (animated = true) => {
        this.rotateTo(0,0,this.props.width,this.props.height,0,animated);
        this.setState({isFull:false,isHideStatusBar:false});
        if (this.props.onMinScreen){
            this.props.onMinScreen();
        }
    }
    initVideoView = () => {
        this.width.setValue(this.props.width>dw ? dw: this.props.width);
        this.height.setValue(this.props.height);
        this.setState({isFull:false});
    }
    listenOrientation = () => {
        this.orientationTimer = setInterval(()=>{
            Orientation.getOrientation((orientation)=>{
                if (orientation !== this.curOrientation){
                    this.curOrientation = orientation;
                    if (orientation === Orientation.TOP) {
                        this.rotateToTop();
                    }else if (orientation === Orientation.LEFT) {
                        this.rotateToLeft();
                    }else if (orientation === Orientation.RIGHT) {
                        this.rotateToRight();
                    }else if (orientation === Orientation.DOWN) {

                    }else{

                    }
                }
            });
        },300);
    }
    componentWillMount(){
        this.width.addListener((event) => {
            this.setState({
                widthValue:event.value
            })
        });
        SFNet.checkNet((value,isWifi)=>{
            if (value == true){//有网非wifi环境
                if (isWifi == false){
                    this.isNoWifi = true;
                    this.checkIsNoWifi();
                }
            }else{

            }
        });
        this.initVideoView();
        this.listenOrientation();
    }

    componentDidMount(){
    }
    componentWillUnmount(){

        this.width.removeAllListeners();
        this.orientationTimer && clearInterval(this.orientationTimer);
        this.onPause();
    }
    checkIsNoWifi = () => {
        if (this.isNoWifi && this.isLoadFinish && SFVideoViewConfig.play_with_nowifi == false){
            this.setState({
                paused:true
            })
            this.refs.prompt.showWithNoWifi(this.props.videoSize)
        }

    }
    onEnd = () => {
        this.setState({
            paused:true
        });
        this.refs.tool.replayBegin()
        if (this.props.onEnd){
            this.props.onEnd();
        }
    }
    onBuffer = (value) =>{
        if (value.isBuffering){
            this.refs.prompt.showWithBuffer();
        }else{
            this.refs.prompt.hide();
        }
    }
    onProgress = (timer) => {
        if (this.isFirst){
            this.isFirst = false;
            this.setState({
                paused:!this.props.autoPlay
            })
            this.isLoadFinish = true;
            this.checkIsNoWifi();
        }
        let curTime =  Math.round(timer.currentTime);
        let totalTime =  0;
        if (Platform.OS === 'android') {
            totalTime = Math.round(timer.playableDuration);
        }else{
            totalTime =  Math.round(timer.seekableDuration);
        }
        this.refs.tool.onProgress(curTime,totalTime)

    }
    onError = (error) => {

        this.refs.prompt.showWithError();
    }

    clickScreen = () =>{
        this.refs.tool.show()
    }
    onFullScree = () => {
        if (this.props.allOrientation){
            Orientation.setOrientationLeft()
        }else{
            this.rotateToLeft();
        }

    }
    onMinScree = () => {
        if (this.props.allOrientation){
            Orientation.setOrientationTop()
        }else{
            this.rotateToTop()
        }

    }
    onPlay = () => {
        this.setState({
            paused:false
        })
    }
    onPause = () => {
        this.setState({
            paused:true
        })
    }
    reloadVideo = () => {
        this.setState({
            isReloaded:true
        },()=>{
            this.setState({
                isReloaded:false
            })
        })
    }
    render_video = () => {
        if (this.state.isReloaded == true){
            return null;
        }
        var source = this.props.source;
        if (source == null || source == ''){
            return null;
        }
        if (typeof(source)=='string') {//网络图片
            source = {uri:source}
        }
        return(
            <TouchableWithoutFeedback onPress={this.clickScreen}>
                <Video source={source}   // Can be a URL or a local file.
                       ref={(ref) => {
                           this.player = ref
                       }}                                      // Store reference
                       rate={1.0}                              // 0 is paused, 1 is normal.
                       volume={this.state.volume}                            // 0 is muted, 1 is normal.
                       muted={false}                           // Mutes the audio entirely.
                       paused={this.state.paused}                          // Pauses playback entirely.
                       resizeMode={this.props.resizeMode}                      // Fill the whole screen at aspect ratio.*
                       repeat={true}                           // Repeat forever.
                       playInBackground={false}                // Audio continues to play when app entering background.
                       playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                       ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                       progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)

                       onProgress={this.onProgress}               // Callback every ~250ms with currentTime
                       onEnd={this.onEnd}                      // Callback when playback finishes
                       onError={this.onError}               // Callback when video cannot be loaded
                       onBuffer={this.onBuffer}                // Callback when remote video is buffering
                       style={{
                           position: 'absolute',
                           top: 0,
                           left: 0,
                           right: 0,
                           bottom:0,
                       }}
                />
            </TouchableWithoutFeedback>
        )
    }
    onLayout = (event) => {

    }
    render() {
        var {
            left,
            top
        } = this.props;
        return (
            <Animated.View style={{
                marginTop: top,
                marginLeft: left,
                width:this.width,
                height:this.height,
                zIndex:9999,
                backgroundColor:this.props.containerBackgroundColor,
                transform:[{translateX:this.posX},{translateY:this.posY},{rotate:this.rotate.interpolate({
                        inputRange: [0,360],
                        outputRange: ['0deg', '360deg'],
                    })}]
            }} onLayout={this.onLayout}>
                <StatusBar hidden={this.state.isHideStatusBar}/>
                {this.render_video()}
                <SFVideoViewTool
                    ref="tool"
                    title={this.props.title}
                    isFull={this.state.isFull}
                    width={this.width}
                    widthValue={this.state.widthValue}
                    height={this.height}
                    autoPlay={this.props.autoPlay}
                    barHeight={this.props.barHeight}
                    progressColor={this.props.progressColor}
                    progressMinColor={this.props.progressMinColor}
                    videoPlaySource={this.props.videoPlaySource}
                    videoPauseSource={this.props.videoPauseSource}
                    videoFullSource={this.props.videoFullSource}
                    videoMinSource={this.props.videoMinSource}
                    onSlider={(timer)=>{
                        this.player.seek(timer);
                    }}
                    onFullScree={this.onFullScree}
                    onMinScree={this.onMinScree}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                    hideDuration={this.props.hideDuration}
                />
                <SFVideoViewPrompt
                    ref="prompt"
                    onSelect={(type)=>{
                        if (type == 0){
                            this.refs.prompt.hide();
                            this.reloadVideo();
                        }else{//非wifi情况
                            this.refs.prompt.hide();
                            SFVideoViewConfig.play_with_nowifi = true;
                            this.setState({
                                paused:false
                            })
                        }
                    }}
                />
                {this.props.children}
            </Animated.View>
        )
    }



}


