import { join } from 'path';
import * as fs from 'fs';

export interface DeviceConfig {
    platformName: string;
    deviceName: string;
    platformVersion: string;
    appPath: string;
    appActivity: string;
    appPackage: string;
    automationName: string;
}

export const loadDeviceConfig = (devices: string[]): DeviceConfig[] => {
    const devicesPath = join(process.cwd(), 'config/devices.json');
    if (!fs.existsSync(devicesPath)) {
        throw new Error(`Device configuration file not found at: ${devicesPath}`);
    }

    const allDevices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));
    return devices.map((device) => {
        if (!allDevices[device]) {
            throw new Error(`Device configuration not found for: ${device}`);
        }

        const config = allDevices[device];
        return {
            ...config,
            appPath: join(process.cwd(), config.appPath), // Resolve app path dynamically
        };
    });
};
