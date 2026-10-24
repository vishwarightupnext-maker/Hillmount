import { useRef, useEffect, useCallback, useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Link2, Undo2, Redo2, RemoveFormatting,
} from "lucide-react";

// ── Toolbar button ────────────────────────────────────────────────────────────
const Btn = ({ onMouseDown, title, active, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={onMouseDown}
    className={[
      "w-7 h-7 flex items-center justify-center rounded text-sm transition-colors select-none",
      active
        ? "bg-blue-200 text-blue-800"
        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900",
    ].join(" ")}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-300 mx-0.5 self-center" />;

const isEmpty = (html) => !html || html === "<br>" || html === "<div><br></div>";

// ── RichTextEditor ────────────────────────────────────────────────────────────
export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write here…",
  minHeight = 140,
}) {
  const editorRef  = useRef(null);
  const composing  = useRef(false);
  const [blank, setBlank] = useState(isEmpty(value));

  // Initialise content once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
      setBlank(isEmpty(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect external clear (e.g. form reset after save)
  useEffect(() => {
    if (!value && editorRef.current && editorRef.current.innerHTML !== "") {
      editorRef.current.innerHTML = "";
      setBlank(true);
    }
  }, [value]);

  const emit = useCallback(() => {
    if (!composing.current) {
      const html = editorRef.current?.innerHTML ?? "";
      setBlank(isEmpty(html));
      onChange?.(html);
    }
  }, [onChange]);

  const exec = useCallback(
    (cmd, val = undefined) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val);
      emit();
    },
    [emit]
  );

  const insertLink = useCallback(() => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  }, [exec]);

  // Intercept paste: convert plain-text newlines → <div> blocks so every
  // line is preserved as a separate block element (not collapsed into one).
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const plain = e.clipboardData.getData("text/plain");
    if (plain) {
      const html = plain
        .split("\n")
        .map((line) => (line.trim() ? `<div>${line}</div>` : "<div><br></div>"))
        .join("");
      document.execCommand("insertHTML", false, html);
    } else {
      // Paste from a rich source — strip external styles, keep structure
      const html = e.clipboardData.getData("text/html");
      document.execCommand("insertHTML", false, html);
    }
    emit();
  }, [emit]);

  const isActive = (cmd) => {
    try { return document.queryCommandState(cmd); }
    catch { return false; }
  };

  const toolbarGroups = [
    [
      { cmd: "bold",          title: "Bold (Ctrl+B)",      icon: <Bold size={13} /> },
      { cmd: "italic",        title: "Italic (Ctrl+I)",    icon: <Italic size={13} /> },
      { cmd: "underline",     title: "Underline (Ctrl+U)", icon: <Underline size={13} /> },
      { cmd: "strikeThrough", title: "Strikethrough",      icon: <Strikethrough size={13} /> },
    ],
    [
      { cmd: "insertOrderedList",   title: "Numbered list", icon: <ListOrdered size={13} /> },
      { cmd: "insertUnorderedList", title: "Bullet list",   icon: <List size={13} /> },
    ],
    [
      { cmd: "_link",        title: "Insert link",       icon: <Link2 size={13} />,           onClick: insertLink },
      { cmd: "removeFormat", title: "Remove formatting", icon: <RemoveFormatting size={13} /> },
    ],
    [
      { cmd: "undo", title: "Undo (Ctrl+Z)", icon: <Undo2 size={13} /> },
      { cmd: "redo", title: "Redo (Ctrl+Y)", icon: <Redo2 size={13} /> },
    ],
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#1E88E5] transition-colors">

      {/* ── Toolbar ── */}
      <div className="bg-gray-50 border-b border-gray-200 flex items-center flex-wrap gap-0.5 px-2 py-1.5">
        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <Divider />}
            {group.map(({ cmd, title, icon, onClick }) => (
              <Btn
                key={cmd}
                title={title}
                active={["bold","italic","underline","strikeThrough"].includes(cmd) && isActive(cmd)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (onClick) onClick();
                  else exec(cmd);
                }}
              >
                {icon}
              </Btn>
            ))}
          </div>
        ))}
      </div>

      {/* ── Editable area ── */}
      <div className="relative">
        {blank && (
          <span
            className="absolute top-0 left-0 px-3 py-2.5 text-sm text-gray-400 pointer-events-none select-none"
            aria-hidden>
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onPaste={handlePaste}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; emit(); }}
          className="px-3 py-2.5 text-sm text-gray-800 outline-none overflow-y-auto leading-relaxed
                     [&_b]:font-bold [&_strong]:font-bold
                     [&_i]:italic [&_em]:italic
                     [&_u]:underline
                     [&_s]:line-through [&_strike]:line-through
                     [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
                     [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
                     [&_a]:text-blue-600 [&_a]:underline"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}
