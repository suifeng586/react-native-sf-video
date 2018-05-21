
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
    ActivityIndicator
} from "react-native";
import PropTypes from 'prop-types';


export default class SFVideoViewPrompt extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isShow:false,
        }
    }

    static propTypes = {
        onSelect: PropTypes.func,
    }
    static defaultProps={

    }
    componentWillMount(){

        // this.state.source = 'http://video.pearvideo.com/mp4/short/20170511/cont-1077737-10445651-sd.mp4';
    }

    componentDidMount(){

    }
    click = () => {
        this.props.onSelect(this.type);
    }
    showWithError = () => {
        this.type = 0;
        this.setState({isShow:true})
    }
    showWithNoWifi = (size) => {
        this.size = size;
        this.type = 1;
        this.setState({isShow:true})
    }
    showWithBuffer = () =>{
        this.type = 2;
        this.setState({isShow:true})
    }
    hide = () => {
        this.setState({isShow:false})
    }
    render_content = () => {
        if (this.type == 0){//加载失败
            return(
                <TouchableWithoutFeedback onPress={this.click}>
                    <View style={{
                        width:120,
                        height:120,
                        justifyContent:'center',
                        alignItems:'center'
                    }}>
                        <Image source={require('./img/video_refresh.png')} style={{
                            width:24,
                            height:24
                        }}></Image>
                        <Text style={{
                            color:'white',
                            fontSize:13,
                            marginTop:10
                        }}>加载失败，点击刷新</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }else if (this.type == 1){//非wifi环境
            var prompt = '';
            if (this.size && this.size !=0){
                prompt = '播放将消耗'+this.size+' M 流量';
            }else{
                prompt = '当前非wifi网络，播放将消耗手机流量';
            }
            return(
                <View style={{
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <Text style={{
                        color:'white',
                        fontSize:13,
                        marginTop:10
                    }}>{prompt}</Text>

                    <Text style={{
                        width:90,
                        height:26,
                        lineHeight:24,
                        borderRadius:13,
                        borderWidth:1,
                        borderColor:'white',
                        color:'white',
                        fontSize:13,
                        marginTop:10,
                        textAlign:'center'
                    }} onPress={this.click}>继续播放</Text>
                </View>
            )
        }else if (this.type == 2){//缓冲
            <View style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center'
            }}>
                <ActivityIndicator
                    animating={true}
                    color="white"
                    size="small"
                />
            </View>
        }
    }
    render() {
        if (this.state.isShow == false){
            return null;
        }
        return (
            <View style={{
                position:'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems:'center',
                justifyContent:'center'
            }} >
                {this.render_content()}
            </View>
        )
    }



}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:'rgba(254,213,66,1)'
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 200,
        height: 200,
    },

});
