var SFVideoOrientation = require('react-native').NativeModules.SFVideoOrientation;
import {
    Platform
} from "react-native";
module.exports = {
    UNKNOWN:'0',
    TOP:'1',
    LEFT:'2',
    RIGHT:'3',
    DOWN:'4',
    getOrientation(cb) {
        SFVideoOrientation.getOrientation((error,orientation) =>{
            cb(orientation.orientation+'');
        });
    },
    setOrientationLeft() {
        SFVideoOrientation.setOrientationLeft();
    },
    setOrientationTop() {
        SFVideoOrientation.setOrientationTop();
    },
    startListener(){
        if (Platform.OS == 'android'){

            SFVideoOrientation.setOrientationEventListener();
        }
    },
    stopListener(){
        if (Platform.OS == 'android') {
            SFVideoOrientation.removeOrientationEventListener();
        }
    }

}
