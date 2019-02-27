export default {
    patternsMatchText(text, patterns) {
        if (!text || !patterns) {
            return false;
        }
        text = text.toUpperCase();
        return patterns.some(pattern => {
            pattern = pattern.toUpperCase();
            return text.includes(pattern);
        });;
    },
    myMethod2() {
      console.log('bar');
    }
};