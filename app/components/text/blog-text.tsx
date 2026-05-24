import type React from "react";

interface BlogTextProps {
    children: string;
    className?: string;
    linkClassName?: string;
}

interface ParsedElement {
    type: "text" | "br" | "p" | "strong" | "em" | "a" | "span";
    content: string;
    attributes?: Record<string, string>;
    children?: ParsedElement[];
}

export function BlogText({
    children,
    className = "",
    linkClassName = "text-blue-600 hover:text-blue-800 underline",
}: BlogTextProps) {
    // Enhanced HTML parser that handles nested tags
    const parseHTML = (html: string): ParsedElement[] => {
        const elements: ParsedElement[] = [];
        let currentIndex = 0;

        while (currentIndex < html.length) {
            const nextTagStart = html.indexOf("<", currentIndex);

            if (nextTagStart === -1) {
                // No more tags, add remaining text
                const remainingText = html.slice(currentIndex).trim();
                if (remainingText) {
                    elements.push({ type: "text", content: remainingText });
                }
                break;
            }

            // Add text before the tag
            if (nextTagStart > currentIndex) {
                const textContent = html.slice(currentIndex, nextTagStart);
                if (textContent.trim()) {
                    elements.push({ type: "text", content: textContent });
                }
            }

            const tagEnd = html.indexOf(">", nextTagStart);
            if (tagEnd === -1) break;

            const fullTag = html.slice(nextTagStart, tagEnd + 1);
            const tagMatch = fullTag.match(/<\/?(\w+)([^>]*)>/);

            if (!tagMatch) {
                currentIndex = tagEnd + 1;
                continue;
            }

            const [, tagName, attributes] = tagMatch;
            const isClosingTag = fullTag.startsWith("</");
            const isSelfClosing = fullTag.endsWith("/>");

            if (tagName.toLowerCase() === "br") {
                elements.push({ type: "br", content: "" });
                currentIndex = tagEnd + 1;
            } else if (
                !isClosingTag &&
                ["p", "strong", "b", "em", "i", "a", "span"].includes(
                    tagName.toLowerCase()
                )
            ) {
                // Find the closing tag
                const closingTag = `</${tagName.toLowerCase()}>`;
                const closingIndex = html.toLowerCase().indexOf(closingTag, tagEnd + 1);

                if (closingIndex !== -1) {
                    const innerContent = html.slice(tagEnd + 1, closingIndex);
                    const parsedAttributes = parseAttributes(attributes);

                    let elementType: ParsedElement["type"] = "text";
                    switch (tagName.toLowerCase()) {
                        case "p":
                            elementType = "p";
                            break;
                        case "strong":
                        case "b":
                            elementType = "strong";
                            break;
                        case "em":
                        case "i":
                            elementType = "em";
                            break;
                        case "a":
                            elementType = "a";
                            break;
                        case "span":
                            elementType = "span";
                            break;
                    }

                    elements.push({
                        type: elementType,
                        content: innerContent,
                        attributes: parsedAttributes,
                        children: innerContent ? parseHTML(innerContent) : [],
                    });

                    currentIndex = closingIndex + closingTag.length;
                } else {
                    currentIndex = tagEnd + 1;
                }
            } else {
                currentIndex = tagEnd + 1;
            }
        }

        return elements;
    };

    const parseAttributes = (attrString: string): Record<string, string> => {
        const attributes: Record<string, string> = {};
        const attrRegex = /(\w+)=["']([^"']*)["']/g;
        let match;

        while ((match = attrRegex.exec(attrString)) !== null) {
            attributes[match[1]] = match[2];
        }

        return attributes;
    };

    const renderElement = (
        element: ParsedElement,
        index: number
    ): React.ReactNode => {
        switch (element.type) {
            case "text":
                return element.content;

            case "br":
                return <br key={index} />;

            case "p":
                return (
                    <p key={index} className="mb-4 last:mb-0">
                        {element.children?.map((child, childIndex) =>
                            renderElement(child, childIndex)
                        )}
                    </p>
                );

            case "strong":
                return (
                    <strong key={index} className="font-bold text-primary">
                        {element.children?.map((child, childIndex) =>
                            renderElement(child, childIndex)
                        )}
                    </strong>
                );

            case "em":
                return (
                    <em key={index} className="italic">
                        {element.children?.map((child, childIndex) =>
                            renderElement(child, childIndex)
                        )}
                    </em>
                );

            case "a":
                const href = element.attributes?.href || "#";
                const target = element.attributes?.target;
                const rel =
                    target === "_blank" ? "noopener noreferrer" : element.attributes?.rel;

                return (
                    <a
                        key={index}
                        href={href}
                        target={target}
                        rel={rel}
                        className={linkClassName}
                    >
                        {element.children?.map((child, childIndex) =>
                            renderElement(child, childIndex)
                        )}
                    </a>
                );

            case "span":
                return (
                    <span key={index} className={element.attributes?.class}>
                        {element.children?.map((child, childIndex) =>
                            renderElement(child, childIndex)
                        )}
                    </span>
                );

            default:
                return element.content;
        }
    };

    const parsedElements = parseHTML(children);

    return (
        <div className={className}>
            {parsedElements.map((element, index) => renderElement(element, index))}
        </div>
    );
}
