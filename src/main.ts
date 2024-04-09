import {
    App,
    CachedMetadata,
    Plugin, PluginSettingTab, Setting, TFile
} from 'obsidian';
import { OnChangeNotification } from './Services/OnChangeNotification';

interface MyPluginSettings {
    url: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    url: 'default'
}


export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        console.log('loading plugin');
        await this.loadSettings();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new MainSettingTab(this.app, this));

        this.registerEvent(this.app.metadataCache.on('changed',
            async (file: TFile, data: string, cache: CachedMetadata) => {
                OnChangeNotification(file, data, cache, this.settings.url);
            }));

    }

    onunload() {
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class MainSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('n8n Webhook URL')
            .addText(text => text
                .setPlaceholder('Enter your the url')
                .setValue(this.plugin.settings.url)
                .onChange(async (value) => {
                    this.plugin.settings.url = value;
                    await this.plugin.saveSettings();
                }));
    }
}
