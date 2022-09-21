// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Range } from 'vscode';
import { 
    arrangeBeautifully, 
    getInputDisplayString, 
    getOutputDisplayString, 
    getObjectDisplayString, 
    getViewChildDisplayString, 
    printArray,
    getPaddedDisplayString
} from './utils';


export function activate(context: vscode.ExtensionContext) {
    let formatterDisposable = vscode.commands.registerCommand('angularcompvargrouper.format', () => {
        const { activeTextEditor } = vscode.window;

        if (activeTextEditor && activeTextEditor.document.languageId === 'typescript') {
            const { document } = activeTextEditor;

            var selectedText = document.getText(activeTextEditor.selection);
            var output = format(selectedText);
            
            const edit = new vscode.WorkspaceEdit();
            edit.replace(
                document.uri, 
                new Range(activeTextEditor.selection.start, activeTextEditor.selection.end), 
                output);

            return vscode.workspace.applyEdit(edit);
        }
    });

    context.subscriptions.push(formatterDisposable);
}

function format(text: string) {
    const TAB_SIZE = 1;

    const inputs: string[] = [];
    const outputs: string[] = [];
    const viewChildren: string[] = [];
    const objects: string[] = [];
    const properties: string[] = [];
    const booleans: string[] = [];
    const arrays: string[] = [];

    const codeLines = arrangeBeautifully(text);

    codeLines.forEach(codeLine => {
        if (isViewChild(codeLine))
            viewChildren.push(codeLine);
        else if (isInput(codeLine))
            inputs.push(codeLine);
        else if (isOutput(codeLine))
            outputs.push(codeLine);
        else if (isProperty(codeLine))
            properties.push(codeLine);
        else if (isBoolean(codeLine))
            booleans.push(codeLine);
        else if (isArray(codeLine))
            arrays.push(codeLine);
        else
            objects.push(codeLine);
    });
    
    var str = "";
    if (inputs.length > 0) {
        str += "\n\n" + getPaddedDisplayString(TAB_SIZE, "//Inputs");
        inputs.sort().forEach(item => str += "\n" + getInputDisplayString(TAB_SIZE, item));
    }
    
    if (outputs.length > 0) {
        str += "\n\n" + getPaddedDisplayString(TAB_SIZE, "//Outputs");
        outputs.sort().forEach(item => str += "\n" + getOutputDisplayString(TAB_SIZE, item));
    }
    
    if (viewChildren.length > 0) {
        str += "\n\n" + getPaddedDisplayString(TAB_SIZE, "//View Children");
        viewChildren.sort().forEach(item => str += "\n" + getViewChildDisplayString(TAB_SIZE, item));
    }
    
    if (properties.length > 0) {
        str += "\n\n" + getPaddedDisplayString(TAB_SIZE, "//Properties");
        properties.sort().forEach(item => str += "\n" + getPaddedDisplayString(TAB_SIZE, item));
    }
    
    if (booleans.length > 0) {
        str += "\n\n" + getPaddedDisplayString(TAB_SIZE, "//Booleans");
        booleans.sort().forEach(item => str += "\n" + getPaddedDisplayString(TAB_SIZE, item));
    }
    
    if (arrays.length > 0) {
        str += "\n\n" + getPaddedDisplayString(TAB_SIZE, "//Arrays");
        arrays.sort().forEach(item => str += "\n" + getPaddedDisplayString(TAB_SIZE, item));
    }
    
    if (objects.length > 0) {
        str += "\n\n" + getPaddedDisplayString(TAB_SIZE, "//Objects");
        objects.sort().forEach(item => str += "\n" + getObjectDisplayString(TAB_SIZE, item));
    }
 
    function isViewChild(text: string) {
        return text.indexOf("@ViewChild") != -1;
    }
    
    function isInput(text: string) {
        return text.indexOf("@Input") != -1;
    }
    
    function isOutput(text: string) {
        return text.indexOf("@Output") != -1;
    }
    
    function isProperty(text: string) {
        if (
            /\w+\s{1}\=\s{1}\d+/.test(text) ||
            text.indexOf(": number;") != -1 ||
            text.indexOf(": string;") != -1 ||
            text.indexOf("= '") != -1 ||
            text.indexOf("= \"") != -1
        ) {
            return true;
        }
    
        return false;
    }
    
    function isBoolean(text: string) {
        if (
            text.indexOf(": boolean;") != -1 ||
            text.indexOf("= false;") != -1 ||
            text.indexOf("= true;") != -1 
        ) {
            return true;
        }
    
        return false;
    }
    
    function isArray(text: string) {
        if (
            text.indexOf("[];") != -1
        ) {
            return true;
        }
    
        return false;
    }

    return str.substring(2, str.length);
}

// this method is called when your extension is deactivated
export function deactivate() {}
