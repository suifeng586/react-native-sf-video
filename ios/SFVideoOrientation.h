//
//  SFVideo.h
//  SFVideo
//
//  Created by rw on 2018/5/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif
@interface SFVideoOrientation : NSObject <RCTBridgeModule>
@end
