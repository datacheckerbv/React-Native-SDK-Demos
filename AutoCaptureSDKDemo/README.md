# React-Native-SDK-Demos

## Overview

This guide provides the necessary steps to set up and run the React Native SDK demos, specifically for the AutoCapture SDK. Follow these instructions to ensure correct configuration for both Android and iOS platforms.

## Prerequisites

1. **Copy SDK:** Place the AutoCapture SDK into a shared folder named `www`. This folder will act as the central location from which both Android and iOS projects will link to the SDK.

2. **Environment Variables:** Create an `.env` file at the root of your project to store configuration like your SDK token. This helps in keeping sensitive information out of your code base.

```plaintext
TOKEN="YOUR_SDK_TOKEN"
```

## iOS Specific Setup

### Managing Dependencies with CocoaPods

Before proceeding, make sure CocoaPods is installed on your system. Run the following command in the terminal within your iOS project directory:

```bash
pod install
```

### Linking the SDK

1. **Symbolic Link Creation:**
   - Open Xcode, then navigate to `AutoCaptureSDKDemo/ios/AutoCaptureSDKDemo.xcworkspace`.
   - Drag the `www` folder into the Xcode project navigator under `AutoCaptureSDKDemo`.
   - Important: Ensure `Copy items if needed` is unchecked to use symbolic links, and `Create folder references` is checked for proper folder nesting.

### App Permissions

Add necessary permissions in the `info.plist` to ensure the app has access to required device capabilities:

```xml
<key>NSCameraUsageDescription</key>
<string>Allow access to the camera</string>
```

### Building and Running

Finally, build and run your application using the following command to ensure all configurations are applied:

```bash
npx react-native run-ios
```
