import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { AppMap } from "./AppMap.js";

export default class QuickerExtension extends Extension {
    enable() {
        this._settings = this.getSettings();

        Object.keys(AppMap).forEach(category => {
            Main.wm.addKeybinding(
                `launch-${category}`,
                this._settings,
                Meta.KeyBindingFlags.NONE,
                Shell.ActionMode.ALL,
                () => this._focusOrLaunch(AppMap[category].appId, AppMap[category].desktopFile)
            );
        });
    }

    disable() {
        Object.keys(AppMap).forEach(category => {
            Main.wm.removeKeybinding(`launch-${category}`);
        });
    }

    _focusOrLaunch(appId, desktopFile) {
        const appSystem = Shell.AppSystem.get_default();
        const runningApps = appSystem.get_running();

        const existing = runningApps.find(app => app.get_id().includes(appId));
        if (existing) {
            existing.activate();
        } else {
            const app = appSystem.lookup_app(`${desktopFile}`);
            if (app) {
                app.activate();
            } else {
                log(`Quicker: Could not find ${desktopFile}`);
            }
        }
    }
}

