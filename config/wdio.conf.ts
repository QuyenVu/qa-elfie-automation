import { loadDeviceConfig } from '../src/utils/deviceLoader';
import { join } from 'path';
import ChromeWelcomeAppPage from '../src/pages/ChromeWelcomeAppPage';
import {readdirSync, rmSync} from "fs-extra";
import {logError, logInfo} from "../src/utils/log";

const devices = process.env.DEVICES || 'emulator1';
const deviceConfigs = loadDeviceConfig([devices]);
const randomPort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
logInfo(`Random port: ${randomPort}`);

export const config = {
    runner: 'local',
    specs: [
        join(process.cwd(), 'src/tests/**/*.spec.ts'),
    ],
    maxInstances: 1,
    capabilities: deviceConfigs.map((device) => ({
        platformName: device.platformName,
        'appium:deviceName': device.deviceName,
        'appium:platformVersion': device.platformVersion,
        'appium:automationName': device.automationName,
        'appium:appPackage': device.appPackage,
        'appium:appActivity': device.appActivity,
        'appium:autoGrantPermissions': true,
        'appium:useNewWDA': true,
        'appium:newCommandTimeout': 240,
    })),
    logLevel: 'info',
    framework: 'mocha',
    reporters: [['allure', { outputDir: 'allure-results' }]],
    mochaOpts: { ui: 'bdd', timeout: 120000 },

    services: [
        [
            'appium',
            {
                args: {
                    port: randomPort,
                    relaxedSecurity: true,
                    logLevel: 'info',
                },
                command: 'appium',
            },
        ],
    ],

    onPrepare: async () => {
        logInfo('Cleaning old data...');
        const imagesFolderPath = join(process.cwd(), 'images');
        try {
            const images = readdirSync(imagesFolderPath); // Get all files in the folder
            for (const image of images) {
                const imagePath = join(imagesFolderPath, image);
                rmSync(imagePath, { force: true });
            }
            logInfo('Images folder content cleaned.');
        } catch (err) {
            logError(`Failed to clean images folder content: ${err}`);
        }

        const allureFolderPath = join(process.cwd(), 'allure-results');
        try {
            rmSync(allureFolderPath, { recursive: true, force: true });
            logInfo('Allure results cleaned.');
        } catch (err) {
            logError(`Failed to clean Allure results: ${err}`);
        }

        const allureReportFolderPath = join(process.cwd(), 'allure-report');
        try {
            rmSync(allureReportFolderPath, { recursive: true, force: true });
            logInfo('Allure Report cleaned.');
        } catch (err) {
            logError(`Failed to clean Allure Report: ${err}`);
        }
    },

    before: async () => {
        require('ts-node').register({ files: true });
        const chromeWelcomeAppPage = new ChromeWelcomeAppPage();
        await chromeWelcomeAppPage.acceptTerms();
        await chromeWelcomeAppPage.noThanks();
    },

    onComplete: async () => {
        logInfo('Tests completed.');
    },

    after: async () => {
        await browser.reloadSession();
    },
};
