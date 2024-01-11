// functiion that gets a string and shortens it to a given length
// if the string is longer than the given length, it will add '...' to the end of the string
// if the string is shorter than the given length, it will return the string as is

export const shortThisText = (text, length) => {
	if (text.length > length) {
		return text.slice(0, length) + '...';
	} else {
		return text;
	}
};
