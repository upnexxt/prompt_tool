# Markdown System Instructions

## Overview

Markdown is a lightweight markup language that allows you to format text using simple syntax. It is widely used for documentation, README files, and writing on platforms like GitHub, Reddit, and more. This document provides detailed instructions on how to use Markdown effectively, along with examples of different syntaxes.

## Basic Syntax

### 1. Headers

Headers are created by placing one or more `#` symbols at the beginning of a line. The number of `#` symbols indicates the level of the header.

```markdown
# Header 1

## Header 2

### Header 3

#### Header 4

##### Header 5

###### Header 6
```

### 2. Emphasis

You can emphasize text using asterisks (`*`) or underscores (`_`).

- _Italic_ text can be created with one asterisk or underscore on each side.
- **Bold** text can be created with two asterisks or underscores on each side.
- **_Bold and Italic_** text can be created with three asterisks or underscores on each side.

```markdown
_Italic_ text
_Italic_ text

**Bold** text
**Bold** text

**_Bold and Italic_** text
**_Bold and Italic_** text
```

### 3. Lists

#### Unordered Lists

Unordered lists can be created using asterisks (`*`), plus signs (`+`), or hyphens (`-`).

```markdown
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

* Item A
* Item B
  - Subitem B.1
  - Subitem B.2

- Item X
- Item Y
```

#### Ordered Lists

Ordered lists are created by placing numbers followed by a period.

```markdown
1. First item
2. Second item
   1. Subitem 2.1
   2. Subitem 2.2
3. Third item
```

### 4. Links

Links can be created using the following syntax:

```markdown
[Link Text](URL "Optional Title")
```

Example:

```markdown
[OpenAI](https://www.openai.com "Visit OpenAI's website")
```

### 5. Images

Images are similar to links but with an exclamation mark (`!`) in front.

```markdown
![Alt Text](Image URL "Optional Title")
```

Example:

```markdown
![OpenAI Logo](https://openai.com/favicon.ico "OpenAI Logo")
```

### 6. Blockquotes

Blockquotes are created by placing a `>` symbol before the text.

```markdown
> This is a blockquote.
> It can span multiple lines.
```

### 7. Code

#### Inline Code

Inline code can be created using backticks (`` ` ``).

```markdown
Here is some `inline code`.
```

#### Code Blocks

Code blocks can be created using triple backticks (` ``` `) or by indenting with four spaces.

```markdown

```

def hello_world():
print("Hello, World!")

```

```

### 8. Horizontal Rules

Horizontal rules can be created using three or more hyphens, asterisks, or underscores.

```markdown
---
```

### 9. Tables

Tables can be created using pipes (`|`) and hyphens (`-`).

```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Row 1    | Row 2    |
| Row 3    | Row 4    |
```

### 10. Task Lists

Task lists can be created using `- [ ]` for unchecked items and `- [x]` for checked items.

```markdown
- [x] Task 1
- [ ] Task 2
- [ ] Task 3
```

## Advanced Syntax

### 1. Footnotes

Footnotes can be created using square brackets and a caret.

```markdown
Here is a sentence with a footnote[^1].

[^1]: This is the footnote text.
```

### 2. Strikethrough

Strikethrough text can be created using two tildes (`~~`).

```markdown
~~This text is strikethrough.~~
```

### 3. Definition Lists

Definition lists can be created using colons.

```markdown
Term 1
: Definition 1

Term 2
: Definition 2
```

## Conclusion

Markdown is a versatile and easy-to-use markup language that allows you to format text in a variety of ways. By using the examples provided in this document, you can create well-structured and visually appealing documents.

For more information, you can refer to the [Markdown Guide](https://www.markdownguide.org/).
