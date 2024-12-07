import {ChainablePromiseElement} from 'webdriverio';
import fs from 'fs';
import {PNG} from 'pngjs';
import pixelMatch from 'pixelmatch';
import {logError, logInfo} from "../utils/log";

export default class BasePage {

    async waitUntilElementIsDisplayedWithTimeout(
        element: ChainablePromiseElement,
        maxTimeout: number = 30000,
        checkInterval: number = 1000
    ): Promise<void> {
        const startTime = Date.now();
        while (Date.now() - startTime < maxTimeout) {
            const isDisplayed = await element.isDisplayed().catch(() => false);
            if (isDisplayed) return;
            await new Promise((resolve) => setTimeout(resolve, checkInterval));
        }
        logError(`Element ${element.selector} not displayed after ${maxTimeout}ms`);
    }

    async compareTwoImagesByPixel(image1: string, image2: string): Promise<number> {
        logInfo(`Comparing images: ${image1} and ${image2}`);
        const img1 = PNG.sync.read(fs.readFileSync(image1));
        const img2 = PNG.sync.read(fs.readFileSync(image2));

        const width = Math.max(img1.width, img2.width);
        const height = Math.max(img1.height, img2.height);

        const resizedImg1 = new PNG({width, height});
        const resizedImg2 = new PNG({width, height});

        PNG.bitblt(img1, resizedImg1, 0, 0, img1.width, img1.height, 0, 0);
        PNG.bitblt(img2, resizedImg2, 0, 0, img2.width, img2.height, 0, 0);

        return pixelMatch(resizedImg1.data, resizedImg2.data, null, width, height, {threshold: 0.1});
    }

    async scrollDown(
        element: ChainablePromiseElement,
        maxScrolls = 5,
        percentage = 100
    ) {
        let isVisible = await element.isDisplayed();
        let scrollCount = 0;

        const screenSize = await driver.getWindowRect();
        const screenWidth = screenSize.width;
        const screenHeight = screenSize.height;

        const scrollAreaHeight = screenHeight * 0.75;
        const scrollAreaWidth = screenWidth;
        const scrollStartTop = screenHeight * 0.1;

        while (!isVisible && scrollCount < maxScrolls) {
            await driver.execute('mobile: scrollGesture', {
                left: 0,
                top: scrollStartTop,
                width: scrollAreaWidth,
                height: scrollAreaHeight,
                direction: 'down',
                percent: percentage,
            });

            isVisible = await element.isDisplayed();
            scrollCount++;
        }

        if (!isVisible) {
            const errorMessage = `Element not found after ${maxScrolls} scrolls`;
            logError(errorMessage);
            throw new Error(errorMessage);
        }
    }
}
