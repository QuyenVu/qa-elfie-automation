import ChromeAppPage from '../pages/ChromeAppPage';
import testData from '../data/testData.json';
import { logInfo, logTestCaseName } from "../utils/log";

const env = process.env.ENV || 'local';

describe('Home Page', () => {
    const chromeAppPage = new ChromeAppPage();

    it('Should perform end-to-end test flow', async () => {
        logTestCaseName('Should perform end-to-end test flow');
        logInfo(`Environment : ${env}`);
        await chromeAppPage.openUrl(testData.url);
        await chromeAppPage.searchKeyword(testData.searchKeyword);

        // Click first search result, verify Elfie logo is displayed, and capture screenshot
        await chromeAppPage.clickFirstSearchResult();
        await expect(await chromeAppPage.isElfieLogoDisplayed()).toBe(true);
        await chromeAppPage.captureScreenshot(testData.screenshotNames.elfieLogo);

        const hamburgerMenuIconPath = await chromeAppPage.captureElementScreenshot(chromeAppPage.hamburgerMenu, testData.screenshotNames.hamburgerMenu);
        await chromeAppPage.hamburgerMenu.click();

        let closeMenuIconPath = '';
        await browser.waitUntil(async () => {
            closeMenuIconPath = await chromeAppPage.captureElementScreenshot(chromeAppPage.closeButton, testData.screenshotNames.xIcon);
            const diffNumber = await chromeAppPage.compareImages(hamburgerMenuIconPath, closeMenuIconPath);
            return diffNumber > 0;
        }, {
            timeout: 20000,
            timeoutMsg: 'Icon did not change after clicking the Hamburger menu',
        });

        await chromeAppPage.closeButton.click();
        const finalDiffNumber = await chromeAppPage.compareImages(hamburgerMenuIconPath, closeMenuIconPath);
        await expect(finalDiffNumber).toBeGreaterThan(0);

        // Scroll to bottom, verify copyright text, and capture screenshot
        await chromeAppPage.scrollUntilVisible(chromeAppPage.copyrightText, 50, 100);
        await expect(await chromeAppPage.getCopyRightText()).toEqual(testData.expectedCopyRightText);
        await chromeAppPage.captureScreenshot(testData.screenshotNames.copyright);
    });
});
