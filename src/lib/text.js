export default function removeLine(text, line) {
	// break the textblock into an array of lines
	var lines = text.split('\n');
	// remove one line, starting at the first position
	lines.splice(line, line + 1);
	// join the array back into a single string
	return lines.join('\n');
}
