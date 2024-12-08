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

- Open Allure report
```shell
npm run allure:generate
npm run allure:open
```

- I tried to create the workflow to run the test on github action. However, I have some issues with the emulator.
- Please check the workflow file in .github/workflows/run-tests.yml

- Note:
````
- The Copyright text is changed to 2024 instead of 2023.
- When I run the test with an emulator API 31, The X button is not displayed on the screen when click on hamburger icon button. However, It is working fine with API 35.
````
![Sample Report Image](https://i.imgur.com/zrnrueN.png)


- Need to be improved:
````
- Scroll method is not working properly on the emulator as what i am expecting.
- Need to setup to run on multi environment and multi device.
- Need to improve the framework to be more flexible and easy to use.
````