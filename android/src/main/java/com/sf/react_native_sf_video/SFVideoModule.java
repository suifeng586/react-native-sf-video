package com.sf.react_native_sf_video;

import android.content.pm.ActivityInfo;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by Administrator on 2018-05-21.
 */

public class SFVideoModule extends ReactContextBaseJavaModule {
    public SFVideoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SFVideoOrientation";
    }

    @ReactMethod
    public void getOrientation(Callback callback){
        int mCurrentOrientation = getCurrentActivity().getResources().getConfiguration().orientation;
        WritableMap map = Arguments.createMap();
        map.putString("orientation",mCurrentOrientation+"");
        callback.invoke(null,map);
    }
    @ReactMethod
    public void setOrientationLeft(){
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    }
    @ReactMethod
    public void setOrientationTop(){
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }
}
