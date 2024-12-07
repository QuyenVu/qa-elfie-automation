QA Automation 

- Install dependencies:
```shell
npm install
```

- Run all tests with specific environment and device
- Please refer to package.json for more details
- To check device configuration, please refer to config/devices.json and wdio.conf.js
```shell
npm run test:emulator3
```

```shell
npm run allure:generate
npm run allure:open
```

- Note:
````
- When I run the test with an emulator API 31, The X button is not displayed on the screen when click on hamburger icon button. However, It is working fine with API 35.

````