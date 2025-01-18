/**
 * Detecteert of de tekst code bevat en formatteert deze naar een code block
 */
export const formatContent = (content: string): string => {
  // Als de tekst al in een code block staat, laat deze ongewijzigd
  if (content.startsWith("```") && content.endsWith("```")) {
    return content;
  }

  // Detecteer of het een code block is
  const isCodeBlock = (text: string): boolean => {
    // Check voor veel voorkomende code patronen
    const codePatterns = [
      /^(const|let|var|function|class|import|export)\s/m, // JavaScript/TypeScript
      /^(def|class|import)\s/m, // Python
      /^(public|private|protected)\s/m, // Java/C#
      /[{};]\s*$/m, // Algemene code syntax
      /^\s*<[^>]+>/m, // HTML/XML
      /^\s*@\w+/m, // Decorators
      /=>/m, // Arrow functions
      /^[\s\t]*if\s*\(/m, // if statements
      /^[\s\t]*for\s*\(/m, // for loops
    ];

    return codePatterns.some((pattern) => pattern.test(text));
  };

  // Detecteer of het Markdown is
  const isMarkdown = (text: string): boolean => {
    const markdownPatterns = [
      /^#\s/m, // Headers
      /^\*\s/m, // Unordered lists
      /^\d\.\s/m, // Ordered lists
      /^\[.*\]/m, // Links
      /^\|.*\|/m, // Tables
      /^>/m, // Blockquotes
      /\*\*.*\*\*/m, // Bold text
      /\_.*\_/m, // Italic text
      /\`.*\`/m, // Inline code
    ];

    return markdownPatterns.some((pattern) => pattern.test(text));
  };

  // Detecteer de programmeertaal
  const detectLanguage = (text: string): string => {
    const languagePatterns = {
      javascript: /^(const|let|var|function|class|import|export)\s|=>/m,
      typescript: /^(interface|type|enum)\s|:\s*(string|number|boolean)/m,
      python: /^(def|class|import)\s|:\s*$/m,
      html: /^\s*<[^>]+>/m,
      css: /^\s*\{[\s\S]*\}\s*$/m,
      sql: /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s/im,
      json: /^\s*\{[\s\S]*\}\s*$|\[[\s\S]*\]\s*$/m,
      markdown: /^#\s|^\*\s|^\d\.\s|^\[.*\]|^\|.*\|/m,
    };

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    return "";
  };

  // Format de content
  if (isCodeBlock(content)) {
    const language = detectLanguage(content);
    return `\`\`\`${language}\n${content}\n\`\`\``;
  } else if (isMarkdown(content)) {
    return content; // Markdown blijft ongewijzigd
  } else {
    // Gewone tekst wordt als Markdown behandeld
    return content;
  }
};
