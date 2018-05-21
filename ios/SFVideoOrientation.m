//
//  SFVideo.m
//  SFVideo
//
//  Created by rw on 2018/5/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SFVideoOrientation.h"
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#else
#import "RCTEventDispatcher.h"
#endif
@implementation SFVideoOrientation
@synthesize bridge = _bridge;

typedef NS_ENUM(NSInteger, SFOrientation) {
  SFVideoOrientationUnknown = 0,//默认从0开始
  SFVideoOrientationPortrait,
  SFVideoOrientationLeft,
  SFVideoOrientationRight,
  SFVideoOrientationDown
};

- (instancetype)init
{
  if ((self = [super init])) {
    
  }
  return self;
  
}




RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(setOrientationLeft)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    
    NSNumber *orientationUnknown = [NSNumber numberWithInt:0];
    [[UIDevice currentDevice] setValue:orientationUnknown forKey:@"orientation"];
    
    NSNumber *orientationTarget = [NSNumber numberWithInt:UIDeviceOrientationLandscapeLeft];
    [[UIDevice currentDevice] setValue:orientationTarget forKey:@"orientation"];
    
  });
  
}
RCT_EXPORT_METHOD(setOrientationTop)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    
    NSNumber *orientationUnknown = [NSNumber numberWithInt:0];
    [[UIDevice currentDevice] setValue:orientationUnknown forKey:@"orientation"];
    
    NSNumber *orientationTarget = [NSNumber numberWithInt:UIDeviceOrientationPortrait];
    [[UIDevice currentDevice] setValue:orientationTarget forKey:@"orientation"];
    
  });
}

RCT_EXPORT_METHOD(getOrientation:(RCTResponseSenderBlock)callback)
{
  UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
  NSString *orientationStr = [self getOrientationStr:orientation];
  callback(@[[NSNull null], @{@"orientation": orientationStr}]);
}

- (NSString *)getOrientationStr: (UIDeviceOrientation)orientation {
  int direction = 0;
  switch (orientation) {
    case UIDeviceOrientationPortrait:
      direction = SFVideoOrientationPortrait;
      break;
      
    case UIDeviceOrientationLandscapeLeft:
      direction = SFVideoOrientationLeft;
      break;
      
    case UIDeviceOrientationLandscapeRight:
      direction = SFVideoOrientationRight;
      break;
      
    case UIDeviceOrientationPortraitUpsideDown:
      direction = SFVideoOrientationDown;
      break;
      
    default:
      switch ([[UIApplication sharedApplication] statusBarOrientation]) {
        case UIInterfaceOrientationPortrait:
          direction = SFVideoOrientationPortrait;
          break;
        case UIInterfaceOrientationLandscapeLeft:
          direction = SFVideoOrientationLeft;
        case UIInterfaceOrientationLandscapeRight:
          
          direction = SFVideoOrientationRight;
          break;
          
        case UIInterfaceOrientationPortraitUpsideDown:
          direction = SFVideoOrientationDown;
          break;
          
        default:
          direction = SFVideoOrientationUnknown;
          break;
      }
      break;
  }
  return [NSString stringWithFormat:@"%d",direction];
}
@end
