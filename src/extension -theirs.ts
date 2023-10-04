// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
// const list: FamilyMember[] = [{
// 	label: "alon balon",
// 	detail: "34878743",
// 	description: "licking ice-cream",
// 	link: "https://verint.net.hilan.co.il/login"
// },{
// 	label: "tuni",
// 	detail: "545454",
// 	description: "cooking",
// 	link: "https://www.ynet.co.il/home"
// },{
// 	label: "roy",
// 	detail: "423423423",
// 	description: "Oh no",
// 	link: "https://www.hugedomains.com/"
// }];
// 	let disposable = vscode.commands.registerCommand("helloworld.hiThere", () => {
//     // The code you place here will be executed every time your command is executed
//     // Display a message box to the user
//     //vscode.window.showInformationMessage('Hi There from HelloWorld123!');
//   });

//   context.subscriptions.push(disposable);
  let disposable = vscode.commands.registerCommand("helloworld.theFamily",async () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // const filtered = await vscode.window.showQuickPick(
	// 	list,{
	// 		matchOnDetail: true
	// 	}
      
    // );

	// vscode.window.createTerminal({
	// 	color: "red",
	// 	name: "TerminalX",
	//   });

	
	const terminal = vscode.window.createTerminal({ name: `My Extension REPL`, color: 'terminal.ansiBlue'});
	terminal.show();

	// if (!filtered) {
	// 	return;
	// }
	// const callableUri = await vscode.env.asExternalUri(vscode.Uri.parse(filtered.link as string));
	
	// vscode.env.openExternal(callableUri);
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

type  FamilyMember = vscode.QuickPickItem & {
	link?: string
}
