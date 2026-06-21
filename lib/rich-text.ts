const allowedTags = new Set(["p", "div", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3", "blockquote", "ul", "ol", "li", "span", "a"]);
const allowedStyles = new Set(["font-family", "font-size", "font-weight", "font-style", "text-decoration", "text-align", "color", "background-color"]);

export function sanitizeRichHtml(value: string) {
  if (!value.trim()) return "";
  if (typeof window === "undefined") return value.includes("<") ? value : plainTextToHtml(value);

  const parser = new DOMParser();
  const document = parser.parseFromString(value, "text/html");
  document.body.querySelectorAll("*").forEach((element) => {
    const tag = element.tagName.toLowerCase();
    if (!allowedTags.has(tag)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }
    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.name === "style") {
        const safeStyle = attribute.value.split(";").map((rule) => rule.trim()).filter(Boolean).filter((rule) => {
          const property = rule.split(":")[0]?.trim().toLowerCase();
          return allowedStyles.has(property);
        }).join("; ");
        if (safeStyle) element.setAttribute("style", safeStyle);
        else element.removeAttribute("style");
        return;
      }
      if (tag === "a" && attribute.name === "href" && /^(https?:|mailto:|\/)/i.test(attribute.value)) return;
      element.removeAttribute(attribute.name);
    });
  });
  return document.body.innerHTML.trim();
}

export function plainTextToHtml(value: string) {
  const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.split(/\n\s*\n/).filter(Boolean).map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`).join("");
}
