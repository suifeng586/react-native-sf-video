package com.sf.react_native_sf_video;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.hardware.SensorManager;
import android.util.Log;
import android.view.OrientationEventListener;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by Administrator on 2018-05-21.
 */

public class SFVideoModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    final BroadcastReceiver receiver;
    AlbumOrientationEventListener listener;
    int currentOrientation = 0;

    public SFVideoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        final ReactApplicationContext ctx = reactContext;

        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Configuration newConfig = intent.getParcelableExtra("newConfig");
                String orientationValue = ""+newConfig.orientation;
                WritableMap params = Arguments.createMap();
                params.putString("orientation", orientationValue);
                if (ctx.hasActiveCatalystInstance()) {
                    ctx
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("OnOrientationChangeed", params);
                }
            }
        };
        ctx.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "SFVideoOrientation";
    }

    @ReactMethod
    public void getOrientation(Callback callback) {
        WritableMap map = Arguments.createMap();
        map.putInt("orientation", currentOrientation);
        callback.invoke(null, map);
    }

    @ReactMethod
    public void setOrientationLeft() {
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    }

    @ReactMethod
    public void setOrientationTop() {
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }
    @ReactMethod
    public void setOrientationEventListener(){
        listener = new AlbumOrientationEventListener(getReactApplicationContext(), SensorManager.SENSOR_DELAY_NORMAL);
        if (listener.canDetectOrientation()) {
            listener.enable();
        } else {
        }
    }
    @ReactMethod
    public void removeOrientationEventListener(){
        listener.disable();
    }

    @Override
    public void onHostResume() {
        final Activity activity = getCurrentActivity();

        if (activity == null) {
            FLog.e(ReactConstants.TAG, "no activity to register receiver");
            return;
        }
        activity.registerReceiver(receiver, new IntentFilter("onConfigurationChanged"));
    }

    @Override
    public void onHostPause() {
        final Activity activity = getCurrentActivity();
        if (activity == null) return;
        try {
            activity.unregisterReceiver(receiver);
        } catch (java.lang.IllegalArgumentException e) {
            FLog.e(ReactConstants.TAG, "receiver already unregistered", e);
        }
    }

    @Override
    public void onHostDestroy() {

    }
    private class AlbumOrientationEventListener extends OrientationEventListener {
        public AlbumOrientationEventListener(Context context) {
            super(context);
        }

        public AlbumOrientationEventListener(Context context, int rate) {
            super(context, rate);
        }

        @Override
        public void onOrientationChanged(int orientation) {
            if (orientation == OrientationEventListener.ORIENTATION_UNKNOWN) {
                return;
            }
            if(orientation == 0){
                currentOrientation = 1;
            }else if(orientation == 270){
                currentOrientation = 2;
            }else if(orientation == 90){
                currentOrientation = 3;
            }else if(orientation == 180){
                currentOrientation = 4;
            }
        }
    }
}
