export function logAction(message: any) {
    console.log(`[Action]       - ${new Date().toLocaleString()} --- ${message}`);
}

export function logVerify(message: any) {
    console.log(
        '\x1b[94m%s\x1b[0m',
        `[Verify]       - ${new Date().toLocaleString()} --- ${message}`
    );
}

export function logInfo(message: any) {
    console.info(
        '\x1b[35m%s\x1b[0m',
        `[Info]         - ${new Date().toLocaleString()} --- ${message}`
    );
}

export function logError(message: any) {
    console.error(
        '\x1b[31m%s\x1b[0m',
        `[Error]        - ${new Date().toLocaleString()} --- ${message}`
    );
}

export function logWarn(message: any) {
    console.warn(
        '\x1b[43m%s\x1b[0m',
        `[Warning]      - ${new Date().toLocaleString()} --- ${message}`
    );
}

export function logTestCaseName(caseName: any) {
    console.warn(
        '\x1b[33m%s\x1b[0m',
        `[TestCase]     - ${new Date().toLocaleString()} ••• Start Test Case: ${caseName}`
    );
}
