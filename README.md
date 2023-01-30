# Clicklog

## About

Simple frida script that Intercept all calbacks of iOS's UIControls, like button click and write to console which of them will be called when user will interact with UIControl.

## Usage

Load script from loacal repo

```
frida -U -p 3923 -l ./ios-clicklog.js
```

Or use Frida CodeShare

```
frida -U -p 3942 --codeshare chepaika/ios-clicklog
```

Set up hooks

```
[iPhone::PID::3923 ]-> hookAllUIControlsAction()
Getting all UIControl's
Get callbacks of UIButton 0x141d0d770
	Set hook on: closure #1 in TestViewController.viewDidLoad()
	Set hook on: TestApp.TestViewController.click1()
	Set hook on: TestApp.TestViewController.click2()
Get callbacks of UIButton 0x141d0ea20
	Set hook on: TestApp.TestViewController.click3()
```

And just clic on button that you interested in

```
Called closure #1 in TestViewController.viewDidLoad()

(0x141d09650) TestApp.TestViewController.click1()

(0x141d09650) TestApp.TestViewController.click2()
```