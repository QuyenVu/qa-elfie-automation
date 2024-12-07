import { ChainablePromiseElement } from 'webdriverio';
import BasePage from './BasePage';
import {logError, logInfo} from "../utils/log";

declare const driver: WebdriverIO.Browser;

export default class ChromeAppPage extends BasePage {
    private locators = {
        searchBar: 'android.widget.EditText',
        searchTextField: '//android.widget.Button[@text="Google Search"]/following-sibling::android.view.View/android.widget.EditText',
        searchResults: '(//android.view.View[@resource-id="rso" or android.widget.TextView[@text="Search Results"]]//android.view.View[@content-desc])[1]',
        elfieLogo: '//android.widget.Image[@text="Elfie icon"]',
        hamburgerMenu: '//android.widget.Button[@text="menu"]',
        closeButton: '//android.widget.Button[@text="menu"]',
        copyrightText: '//android.view.View[@content-desc="webflow"]/preceding-sibling::android.widget.TextView',
    };

    get searchBar(): ChainablePromiseElement {
        return $(this.locators.searchBar);
    }

    get searchTextField(): ChainablePromiseElement {
        return $(this.locators.searchTextField);
    }

    get searchResults(): ChainablePromiseElement {
        return $(this.locators.searchResults);
    }

    get elfieLogo(): ChainablePromiseElement {
        return $(this.locators.elfieLogo);
    }

    get hamburgerMenu(): ChainablePromiseElement {
        return $(this.locators.hamburgerMenu);
    }

    get closeButton(): ChainablePromiseElement {
        return $(this.locators.closeButton);
    }

    get copyrightText(): ChainablePromiseElement {
        return $(this.locators.copyrightText);
    }

    async openUrl(url: string): Promise<void> {
        try {
            await this.waitUntilElementIsDisplayedWithTimeout(this.searchBar);
            await this.searchBar.setValue(url);
            await driver.pressKeyCode(66);
        } catch (error) {
            logError(`Failed to open URL: ${url} ${error}`);
            throw error;
        }
    }

    async searchKeyword(keyword: string): Promise<void> {
        let attempts = 0;
        const maxAttempts = 3;
        let searchSuccessful = false;

        await this.waitUntilElementIsDisplayedWithTimeout(this.searchTextField);
        await this.searchTextField.click();
        await this.searchTextField.setValue(keyword);
        while (!searchSuccessful && attempts < maxAttempts) {
            try {
                await driver.pressKeyCode(66);
                searchSuccessful = await this.searchResults.isDisplayed();
            } catch (error) {
                attempts++;
                logInfo(`Retrying search action, attempt: ${attempts}`);
            }
        }
        if (!searchSuccessful) {
            const errorMessage = 'Search action failed after multiple attempts';
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    async scrollUntilVisible(
        element: ChainablePromiseElement,
        maxScrolls = 5,
        percentage = 100
    ) {
        await this.scrollDown(element, maxScrolls, percentage);
    }

    async captureScreenshot(name: string): Promise<string> {
        const screenshotPath = `./images/${name}.png`;
        try {
            await driver.saveScreenshot(screenshotPath);
            logInfo(`Screenshot saved: ${screenshotPath}`);
        } catch (error) {
            logError(`Failed to capture screenshot: ${name} ${error}`);
            throw error;
        }
        return screenshotPath;
    }

    async captureElementScreenshot(element: ChainablePromiseElement, name:String): Promise<string> {
        const screenshotPath = `./images/${name}.png`;
        await this.waitUntilElementIsDisplayedWithTimeout(element);
        try {
            await element.saveScreenshot(screenshotPath);
            logInfo(`Screenshot saved: ${screenshotPath}`);
        } catch (error) {
            logError(`Failed to capture screenshot: ${name} ${error}`);
            throw error;
        }
        return screenshotPath;
    }

    async isElfieLogoDisplayed(): Promise<boolean> {
        try {
            await this.waitUntilElementIsDisplayedWithTimeout(this.elfieLogo);
            return await this.elfieLogo.isDisplayed();
        } catch (error) {
            logError('Failed to check if Elfie logo is displayed : ' + error);
            throw error;
        }
    }

    async clickFirstSearchResult(): Promise<void> {
        try {
            await this.waitUntilElementIsDisplayedWithTimeout(this.searchResults);
            await this.searchResults.click();
        } catch (error) {
            logError('Failed to click first search result : ' + error);
            throw error;
        }
    }

    async getCopyRightText(): Promise<string> {
        try {
            await this.waitUntilElementIsDisplayedWithTimeout(this.copyrightText);
            const text = await this.copyrightText.getText();
            logInfo('Text:' + text);
            return text;
        } catch (error) {
            logError('Failed to get copyright text ; ' + error);
            throw error;
        }
    }

    async compareImages(image1: string, image2: string): Promise<number> {
        return await this.compareTwoImagesByPixel(image1, image2)
    }

}