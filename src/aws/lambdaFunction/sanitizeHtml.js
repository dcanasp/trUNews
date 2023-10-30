"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtml = void 0;
function sanitizeHtml(input) {
    var output = '';
    var stack = [];
    var textBuffer = '';
    var tagBuffer = '';
    var isTag = false;
    var isImgTag = false; // New flag to check if inside <img> tag
    for (var i = 0; i < input.length; i++) {
        var c = input[i];
        if (c === '<') {
            if (!isTag) {
                isTag = true;
                textBuffer = '';
                tagBuffer = c;
            }
            else {
                // Nested '<'
                textBuffer += tagBuffer;
                tagBuffer = c;
            }
        }
        else if (c === '>') {
            if (isTag) {
                isTag = false;
                tagBuffer += c;
                // Check for <img> tag
                if (/^<img[^>]*>$/.test(tagBuffer.toLowerCase())) {
                    isImgTag = true;
                }
                // Check for </img> tag
                if (/^<\/img>$/.test(tagBuffer.toLowerCase())) {
                    isImgTag = false;
                }
                if (isImgTag) {
                    continue; // Skip including this tag and its content in the output
                }
                // Push or pop stack based on the tag
                if (/^<\/[^>]+>$/.test(tagBuffer)) {
                    var last = stack.pop();
                    if (last) {
                        output += last.text + ' ';
                    }
                }
                else if (/^<[^>]+>$/.test(tagBuffer)) {
                    stack.push({ tag: tagBuffer, text: textBuffer });
                }
                else {
                    output += tagBuffer + ' ';
                }
                tagBuffer = '';
            }
            else {
                if (!isImgTag) {
                    output += c;
                }
            }
        }
        else {
            if (isTag) {
                tagBuffer += c;
            }
            else {
                if (!isImgTag) {
                    output += c;
                }
            }
        }
    }
    output += textBuffer;
    var characters = ['&nbsp;', '&quot', '&amp', '&lt', '&gt', '&oelig', '&scaron', '&circ', '&tilde', '&ensp', '&emsp', '&thinsp', '&zwnj', '&zwj', '&lrm', '&rlm', '&ndash', '&mdash', '&lsquo', '&rsquo', '&sbquo', '&ldquo', '&rdquo', '&bdquo', '&dagger', '&permil', '&lsaquo', '&rsaquo', '&euro'];
    for (var _i = 0, characters_1 = characters; _i < characters_1.length; _i++) {
        var char = characters_1[_i];
        output = output.replace(char, ' ');
    }
    return output.trim();
}
exports.sanitizeHtml = sanitizeHtml;
