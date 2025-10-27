"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  ContentBlock,
} from "draft-js";
import "draft-js/dist/Draft.css";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Pilcrow,
} from "lucide-react";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one", icon: Heading1 },
  { label: "H2", style: "header-two", icon: Heading2 },
  { label: "Quote", style: "blockquote", icon: Quote },
  { label: "UL", style: "unordered-list-item", icon: List },
  { label: "OL", style: "ordered-list-item", icon: ListOrdered },
  { label: "Code", style: "code-block", icon: Code },
  { label: "Paragraph", style: "unstyled", icon: Pilcrow },
];

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD", icon: Bold },
  { label: "Italic", style: "ITALIC", icon: Italic },
  { label: "Underline", style: "UNDERLINE", icon: Underline },
  { label: "Code", style: "CODE", icon: Code },
];

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something amazing...",
  minHeight = 120,
  maxHeight = 200,
}: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        const contentState = convertFromRaw(parsed);
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    } catch {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  const handleChange = useCallback(
    (state: EditorState) => {
      setEditorState(state);
      const content = state.getCurrentContent();
      if (
        content.hasText() ||
        content.getBlockMap().some((block) => block?.getType() !== "unstyled")
      ) {
        const raw = JSON.stringify(convertToRaw(content));
        onChange(raw);
      } else {
        onChange("");
      }
    },
    [onChange]
  );

  const handleKeyCommand = useCallback(
    (command: string, state: EditorState) => {
      const newState = RichUtils.handleKeyCommand(state, command);
      if (newState) {
        handleChange(newState);
        return "handled";
      }
      return "not-handled";
    },
    [handleChange]
  );

  const toggleInlineStyle = (style: string) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const getBlockStyle = (block: ContentBlock) => {
    switch (block.getType()) {
      case "header-one":
        return "text-2xl font-bold leading-tight mb-2";
      case "header-two":
        return "text-xl font-semibold leading-snug mb-2";
      case "blockquote":
        return "border-l-4 border-gray-300 pl-4 italic my-2 text-gray-600";
      case "code-block":
        return "font-mono text-sm bg-gray-100 p-2 rounded my-2 overflow-x-auto";
      case "unordered-list-item":
        return "list-disc ml-6 my-1";
      case "ordered-list-item":
        return "list-decimal ml-6 my-1";
      default:
        return "mb-1 leading-relaxed";
    }
  };

  const currentBlockType = () => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    return block.getType();
  };

  return (
    <Card className="w-full border-2 border-gray-900 bg-white z-50">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-gray-900 bg-gray-100 rounded-t-lg">
        {/* Inline Styles */}
        <div className="flex items-center gap-1 mr-4 pr-4 border-r border-gray-400">
          {INLINE_STYLES.map((btn) => {
            const Icon = btn.icon;
            return (
              <Button
                key={btn.style}
                type="button"
                size="sm"
                onClick={() => toggleInlineStyle(btn.style)}
                className={`h-8 w-8 p-0 ${
                  editorState.getCurrentInlineStyle().has(btn.style)
                    ? "bg-blue-600 text-white border border-blue-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                title={btn.label}
              >
                <Icon size={16} />
              </Button>
            );
          })}
        </div>

        {/* Block Types */}
        <div className="flex items-center gap-1 flex-wrap">
          {BLOCK_TYPES.map((btn) => {
            const Icon = btn.icon;
            const isActive = currentBlockType() === btn.style;
            return (
              <Button
                key={btn.style}
                type="button"
                size="sm"
                onClick={() => toggleBlockType(btn.style)}
                className={`h-8 px-2 ${
                  isActive
                    ? "bg-green-600 text-white border border-green-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                title={btn.label}
              >
                <Icon size={14} className="mr-1" />
                <span className="text-xs">{btn.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div
        className="p-4 overflow-y-auto prose prose-sm max-w-none cursor-text bg-white"
        style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
        onClick={focusEditor}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleChange}
          handleKeyCommand={handleKeyCommand}
          placeholder={placeholder}
          spellCheck={true}
          blockStyleFn={getBlockStyle}
        />
      </div>

      
    </Card>
  );
}
