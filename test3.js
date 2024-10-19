// The BBCode string containing the image tag
const bbcode = `[b]The CEO believes it is an innovative company and would be interested in co-creating with us for the possibility of opening Everyoung in Valencia or Bilbao.[/b]
[img width=74px]//b02b56ce0420cf8976791c192a06b4d3.cdn.bubble.io/f1728898623832x842859488559098100/richtext_content.jpeg[/img]`;

// The regex pattern to match the URL inside the [img] tag
const regex = /(?<=\[img\s+width=\d+px\]).*?(?=\[\/img\])/;

// Function to extract the URL
function extractImageUrl(text) {
  const match = text.match(regex);
  return match ? match[0] : null;
}

// Test the function
const extractedUrl = extractImageUrl(bbcode);

if (extractedUrl) {
  console.log("Extracted URL:", extractedUrl);
} else {
  console.log("No URL found in the BBCode.");
}

// You can also test with multiple occurrences
const multipleBBCode = `
${bbcode}
[img width=100px]//another-example-url.com/image.jpg[/img]
`;

const allUrls = multipleBBCode.match(new RegExp(regex, 'g'));
console.log("All extracted URLs:", allUrls);