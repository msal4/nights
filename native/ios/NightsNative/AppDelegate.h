#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
//@property (assign) BOOL castContextSet;
@property (nonatomic, assign) UIBackgroundTaskIdentifier taskIdentifier;
@end
