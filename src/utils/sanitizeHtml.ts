type TagInfo = { tag: string; text: string };

export function sanitizeHtml(input: string): string {
  let output = '';
  let stack: TagInfo[] = [];
  let textBuffer = '';
  let tagBuffer = '';
  let isTag = false;
  let isImgTag = false; // New flag to check if inside <img> tag

  for (let i = 0; i < input.length; i++) {
    const c = input[i];

    if (c === '<') {
      if (!isTag) {
        isTag = true;
        textBuffer = '';
        tagBuffer = c;
      } else {
        // Nested '<'
        textBuffer += tagBuffer;
        tagBuffer = c;
      }
    } else if (c === '>') {
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
          const last = stack.pop();
          if (last) {
            output += last.text+ ' ';
          }
        } else if (/^<[^>]+>$/.test(tagBuffer)) {
          stack.push({ tag: tagBuffer, text: textBuffer });
        } else {
          output += tagBuffer + ' ';
        }

        tagBuffer = '';
      } else {
        if (!isImgTag) {
          output += c;
        }
      }
    } else {
      if (isTag) {
        tagBuffer += c;
      } else {
        if (!isImgTag) {
          output += c;
        }
      }
    }
  }

  output += textBuffer;
  const characters = ['&nbsp','&quot', '&amp', '&lt', '&gt', '&oelig', '&scaron', '&circ', '&tilde', '&ensp', '&emsp', '&thinsp', '&zwnj', '&zwj', '&lrm', '&rlm', '&ndash', '&mdash', '&lsquo', '&rsquo', '&sbquo', '&ldquo', '&rdquo', '&bdquo', '&dagger', '&permil', '&lsaquo', '&rsaquo', '&euro']
  for (const char of characters) {
    output = output.replace(char, ' ');
  }

  return output.trim();
}
