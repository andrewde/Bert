export default {
    patternsMatchText(text, patterns) {
        if (!text || !patterns) {
            return false;
        }
        const upperCaseText = text.toUpperCase();
        return patterns.some(pattern => upperCaseText.includes(pattern.toUpperCase()));
    }
};
