"use client";
import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" },
];

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" },
];

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );

  const handleChange = (state: EditorState) => {
    setEditorState(state);

    // Save as raw JSON
    const raw = JSON.stringify(convertToRaw(state.getCurrentContent()));
    onChange(raw);
  };

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style: string) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div className="border rounded-lg p-3 min-h-[120px]">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2 text-sm">
        {/* Block styles */}
        {BLOCK_TYPES.map((btn) => (
          <button
            key={btn.style}
            type="button"
            onClick={() => toggleBlockType(btn.style)}
            className={`px-2 py-1 rounded border ${
              editorState
                .getCurrentContent()
                .getBlockForKey(editorState.getSelection().getStartKey())
                .getType() === btn.style
                ? "bg-gray-300 font-bold"
                : "bg-gray-100"
            }`}
          >
            {btn.label}
          </button>
        ))}

        {/* Inline styles */}
        {INLINE_STYLES.map((btn) => (
          <button
            key={btn.style}
            type="button"
            onClick={() => toggleInlineStyle(btn.style)}
            className={`px-2 py-1 rounded border ${
              editorState.getCurrentInlineStyle().has(btn.style)
                ? "bg-gray-300 font-bold"
                : "bg-gray-100"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Draft.js Editor */}
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        placeholder="Write your message..."
      />
    </div>
  );
}
