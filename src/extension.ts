// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

type TerminalConfig = {
  name: string;
  color: string;
  iconPath: string;
  command?: string;
};

enum  BooleanSetting {
	resetBeforeCreate = "resetBeforeCreate",
	createOnStartup = "createOnStartup"
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

  if (getBooleanSettingState(BooleanSetting.createOnStartup)) {
    createTerminals();
  }

  let disposable = vscode.commands.registerCommand(
    "terminals-control.createTerminals",
    createTerminals
  );

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    "terminals-control.killTerminals",
    killTerminals
  );

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    "terminals-control.runAll",
    runAllRegisteredCommands
  );

  context.subscriptions.push(disposable);

  // TODO - Currently not applied - no solution how to send ctrl+c to console
  // disposable = vscode.commands.registerCommand(
  //   "terminals-control.abortAll",
  //   abortAllRunningCommands
  // );

  // context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function createTerminals() {
  let customTerminals: vscode.Terminal[] | undefined;

  if (getBooleanSettingState(BooleanSetting.resetBeforeCreate)) {
    vscode.window.terminals?.forEach((terminal) => terminal.dispose());
  }

  const configedTerminals: TerminalConfig[] | undefined =
    getConfigedTerminalList();

  if (!configedTerminals) {
    return;
  }

  // const settings = await vscode.workspace.fs.readFile(vscode.Uri.parse('%APPDATA%\\Roaming\\Code\\User\\settings.json'));

  customTerminals = configedTerminals?.map((terminalConfig) => {
    const { name, color, iconPath } = terminalConfig;
    const newColor = `terminal.ansi${
      color.charAt(0).toUpperCase() + color.slice(1)
    }`;

    const terminal = vscode.window.createTerminal({
      name,
      color: new vscode.ThemeColor(newColor),
      iconPath: new vscode.ThemeIcon(iconPath),
    });

    return terminal;
  });

  customTerminals?.forEach((customTerminal) => customTerminal.show());
}

function killTerminals() {
  vscode.window.terminals?.forEach((terminal) => terminal.dispose());
  vscode.window.createTerminal().show();
}

function runAllRegisteredCommands() {
  const configedTerminals = getConfigedTerminalList();

  configedTerminals?.forEach((configedTerminal) => {
    const terminal: vscode.Terminal | undefined = vscode.window.terminals.find(
      (terminal) => terminal.name === configedTerminal.name
    );

    configedTerminal.command && terminal?.sendText((<unknown>configedTerminal.command) as string, true);
  });
}

async function abortAllRunningCommands() {
  const configedTerminals = getConfigedTerminalList();

  configedTerminals?.forEach((configedTerminal) => {
    if (configedTerminal.command) {
      const terminal: vscode.Terminal | undefined =
        vscode.window.terminals.find(
          (terminal) => terminal.name === configedTerminal.name
        );

      terminal?.processId.then((PID) => {
        if (!PID) {
          return;
        }

        const killCOmmand = `taskkill /F /PID ${PID}`;

        terminal?.sendText(killCOmmand, true);
      });
    }
  });
}

///////////////////////////

function getConfigedTerminalList(): TerminalConfig[] | undefined {
  const terminalsControl: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration("terminals-control");

  if (!terminalsControl) {
    return undefined;
  }

  const configedTerminals: TerminalConfig[] | undefined =
    terminalsControl.get<TerminalConfig[]>("terminals");

  return configedTerminals;
}

function getBooleanSettingState(booleanSetting: BooleanSetting): boolean {
  const terminalsControl: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration("terminals-control");

  const isTrue: boolean =
    terminalsControl.get<boolean>(booleanSetting) ?? true;

  return isTrue;
}

// "terminals-control.terminals": [
//     { "name": "ugs", "color": "green", "iconPath": "debug-start" },
//     { "name": "mccx", "color": "green", "iconPath": "debug-start" },
//     {
//       "name": "git",
//       "color": "blue",
//       "iconPath": "source-control-view-icon"
//     },
//     {
//       "name": "reflog",
//       "color": "blue",
//       "iconPath": "source-control-view-icon"
//     },
//     {
//       "name": "yarn",
//       "color": "red",
//       "iconPath": "source-control-view-icon"
//     }
//   ]
