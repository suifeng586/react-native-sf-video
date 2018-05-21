var SFVideoOrientation = require('react-native').NativeModules.SFVideoOrientation;

module.exports = {
    UNKNOWN:'0',
    TOP:'1',
    LEFT:'2',
    RIGHT:'3',
    DOWN:'4',
    getOrientation(cb) {
        SFVideoOrientation.getOrientation((error,orientation) =>{
            cb(orientation.orientation);
        });
    },
    setOrientationLeft() {
        SFVideoOrientation.setOrientationLeft();
    },
    setOrientationTop() {
        SFVideoOrientation.setOrientationTop();
    }
}
