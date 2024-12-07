import { ChainablePromiseElement } from 'webdriverio';
import BasePage from "./BasePage";


export default class ChromeAppPage extends BasePage {
    private locators = {
        termsAcceptOrUseOtherAccBtn: '//android.widget.Button[@resource-id="com.android.chrome:id/terms_accept" or @resource-id="com.android.chrome:id/signin_fre_dismiss_button"]',
        noThanksOrGotItBtn: '//android.widget.Button[@resource-id="com.android.chrome:id/negative_button" or @resource-id="com.android.chrome:id/ack_button"]',
    };

    get termsAcceptOrOtherAccBtn(): ChainablePromiseElement {
        return $(this.locators.termsAcceptOrUseOtherAccBtn);
    }

    get noThanksOrGotItBtn(): ChainablePromiseElement {
        return $(this.locators.noThanksOrGotItBtn);
    }

    async acceptTerms(): Promise<void> {
        await this.waitUntilElementIsDisplayedWithTimeout(this.termsAcceptOrOtherAccBtn, 120000);
        await this.termsAcceptOrOtherAccBtn.click();
    }

    async noThanks(): Promise<void> {
        await this.scrollDown(this.noThanksOrGotItBtn, 3, 10);
        await this.waitUntilElementIsDisplayedWithTimeout(this.noThanksOrGotItBtn);
        await this.noThanksOrGotItBtn.click();
    }
}
