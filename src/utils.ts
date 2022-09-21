const getValidComponents = (codeLines: string[]) => {
    const validComponents = [];
    for (let i = 0; i < codeLines.length; i++) {
        let lineText = codeLines[i].trim();

        if (
            lineText === '' ||
            lineText.substring(0, 2) == '//' ||
            lineText.substring(0, 2) == '/*' ||
            lineText.substring(0, 2) == '*' ||
            lineText.substring(0, 2) == '*/'
        )  {

        }
        else {
            lineText = lineText.replace(/\s+/g, ' ');
            validComponents.push(lineText);
        }
    }

    return validComponents;
}

const printArray = (arr: string[]) => arr.forEach(item => console.log(item));

const getOneLineCode = (text: string) => {
    const validComponents = getValidComponents(text.split("\n"));
    return validComponents.join("☺");
};

const arrangeBeautifully = (text: string) => {
    let oneLineCode = getOneLineCode(text);

    let i = 0;
    let code = "";
    let brackets = 0;
    let semicolons = 0;
    let output: string[] = [];

    do {
        var char = charAt(i);
        if (char == ";") {
            code += char;
            semicolons += 1;

            if (brackets == 0)
                pushAndResetParams(code);
        }
        else if (char == "}") {
            code += char;
            brackets -= 1;

            if (brackets == 0 && semicolons > 0)
                pushAndResetParams(code);
            else if (brackets == 0 && charAt(i + 1) == ";") {
                code += ";";
                i += 1;
                pushAndResetParams(code);
            }
        }
        else if (char == "{") {
            code += char;
            brackets += 1;
            if (charAt(i + 1) != " ") {
                code += " ";
            }
        }
        else if (char == "/") {
            if (charAt(i + 1) == "/") {
                do {
                    i += 1;
                } while (charAt(i) != '☺');
            }
        }
        else if (char === ":" || char === ",") {
            code += char;
            if (charAt(i + 1) != " ") {
                code += " ";
            }
        }
        else if (char == "=") {
            if (charAt(i - 1) != " ")
                char += " ";

            code += char;

            if (charAt(i + 1) != " ")
                char += " ";
        }
        else if (char == '☺') {

        }
        else
            code += char;

        i++;
    } while (i < oneLineCode.length);

    function charAt(index: number) {
        return oneLineCode.charAt(index);
    }

    function pushAndResetParams(_code: string) {
        output.push(_code.trim());
        resetParams();
    }

    function resetParams() {
        code = "";
        brackets = 0;
        semicolons = 0;
    }

    return output;
}

const getInputDisplayString = (tabSize: number, text: string) => {
    return getDecoratedItemDisplayString(tabSize, text);
}

const getOutputDisplayString = (tabSize: number, text: string) => {
    return getDecoratedItemDisplayString(tabSize, text);
}

const getViewChildDisplayString = (tabSize: number, text: string) => {
    return getDecoratedItemDisplayString(tabSize, text);
}

const getDecoratedItemDisplayString = (tabSize: number, text: string) => {
    var output = getPadding(tabSize);
    return getNormalDecoratedItemString();

    function getNormalDecoratedItemString() {
        let i = 0;
        let prevChar = "\n";
        let _tabSize = tabSize;
        let declarationDone = false;
        
        do {
            const char = text[i];

            if (char == ")") {
                if (!declarationDone) {
                    output += `${char}\n${getPadding(_tabSize)}`;
                    declarationDone = true;
                    prevChar = "\n";
                }
                else {
                    output += `${char}`;
                    prevChar = char;
                }
            }
            else if (char == "{") {
                if (declarationDone) {
                    _tabSize += 1;
                    output += `${char}\n${getPadding(_tabSize)}`;
                    prevChar = "\n";
                }
                else {
                    if (lastCharacter() != " ") {
                        output += " ";
                    }

                    output += char

                    if (text[i + 1] != " ") {
                        output += " ";
                    }

                    prevChar = char;
                }
            }
            else if (char == "}") {
                if (declarationDone) {
                    output = output.substring(0, output.length - 1);

                    _tabSize -= 1;
                    output += `${char}\n${getPadding(_tabSize)}`;
                    prevChar = "\n";
                }
                else {
                    if (lastCharacter() != " ") {
                        output += " ";
                    }

                    output += char;

                    prevChar = char;
                }
            }
            else if (char == ";") {
                output += `${char}\n${getPadding(_tabSize)}`;
                prevChar = "\n";
            }
            else {
                if (
                    (prevChar == "\n" && char != " ") ||
                    prevChar != "\n"
                ) {
                    output += char;
                    prevChar = char;
                }                
            }

            i ++;
        } while (i < text.length);

        return output.substring(0, output.length - 2);

        function lastCharacter() {
            return output[output.length - 1];
        }
    }
}

const getObjectDisplayString = (tabSize: number, text: string) => {
    if (text.indexOf(",") != -1 && text.indexOf("{") != -1) {
        var output = getPadding(tabSize);

        let i = 0;
        let _tabSize = tabSize;
        let prevChar = "\n";
        let declarationDone = false;

        do {
            var char = text[i];
            if (char == "{" && declarationDone) {
                _tabSize += 1;
                output += "{\n" + getPadding(_tabSize);
                prevChar = "\n";
            }
            else if (char == "}" && declarationDone) {
                _tabSize -= 1;
                output += "\n" + getPadding(_tabSize) + "}";
                prevChar = "}";               
            }
            else if (char == "}" && !declarationDone) {
                if (output[output.length - 1] != " ") {
                    output += " }";
                }
                else 
                    output += "}";
            }
            else if (text[i] == ",") {
                output += ",\n" + getPadding(_tabSize);
                prevChar = "\n";
            }
            else if (text[i] == "=") {
                output += "=";
                declarationDone = true;
            }
            else {
                if (
                    (prevChar == "\n" && text[i] != " ") ||
                    prevChar != "\n"
                ) {
                    output += char;
                    prevChar = char;
                }
            }

            i ++;
        } while (i < text.length);

        return output;
    }

    return getPadding(tabSize) + text;
}

const getPaddedDisplayString = (tabSize: number, text: string) => {
    return getPadding(tabSize) + text;
}

function getPadding(tabSize: number) {
    return new Array(tabSize).fill("\t").join("");
}

export {
    getValidComponents,
    printArray,
    getOneLineCode,
    arrangeBeautifully,
    getInputDisplayString,
    getOutputDisplayString,
    getObjectDisplayString,
    getViewChildDisplayString,
    getPaddedDisplayString
};