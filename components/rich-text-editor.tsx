"use client";

import { useEffect, useRef } from "react";
import { sanitizeRichHtml } from "@/lib/rich-text";

type Props = { value: string; onChange: (value: string) => void; placeholder?: string };

export function RichTextEditor({ value, onChange, placeholder = "Write your post..." }: Props) {
  const editor = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editor.current && editor.current.innerHTML !== value) editor.current.innerHTML = value;
  }, [value]);

  function update() {
    if (!editor.current) return;
    onChange(sanitizeRichHtml(editor.current.innerHTML));
  }

  function command(name: string, commandValue?: string) {
    editor.current?.focus();
    document.execCommand(name, false, commandValue);
    update();
  }

  return (
    <div className="rich-editor-shell">
      <div className="rich-editor-tools" aria-label="Post formatting tools">
        <button aria-label="Bold" onMouseDown={(event) => { event.preventDefault(); command("bold"); }} type="button"><strong>B</strong></button>
        <button aria-label="Italic" onMouseDown={(event) => { event.preventDefault(); command("italic"); }} type="button"><em>I</em></button>
        <button aria-label="Underline" onMouseDown={(event) => { event.preventDefault(); command("underline"); }} type="button"><u>U</u></button>
        <button aria-label="Heading" onMouseDown={(event) => { event.preventDefault(); command("formatBlock", "h2"); }} type="button">H2</button>
        <button aria-label="Paragraph" onMouseDown={(event) => { event.preventDefault(); command("formatBlock", "p"); }} type="button">P</button>
        <button aria-label="Bulleted list" onMouseDown={(event) => { event.preventDefault(); command("insertUnorderedList"); }} type="button">List</button>
      </div>
      <div
        className="rich-editor"
        contentEditable
        data-placeholder={placeholder}
        onBlur={update}
        onInput={update}
        onPaste={() => window.setTimeout(update, 0)}
        ref={editor}
        role="textbox"
        suppressContentEditableWarning
      />
      <p className="rich-editor-note">Paste from Google Docs to retain paragraphs, headings, lists, emphasis, and basic font styling.</p>
    </div>
  );
}
