"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { v4 as uuid } from "uuid";
import { 
  Play, 
  Plus, 
  Trash2, 
  FolderOpen, 
  Search,

  Settings,
  FileText,
  FileCode,
  FileJson,
  FileType,
  File,
  ChevronDown,
  ChevronRight,
  Circle,
  Square,
  Minus
} from "lucide-react";

interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  path?: string;
}

const languageConfig = {
  javascript: { icon: FileCode, color: "text-yellow-400", name: "JavaScript" },
  typescript: { icon: FileType, color: "text-blue-400", name: "TypeScript" },
  python: { icon: FileCode, color: "text-green-400", name: "Python" },
  html: { icon: FileText, color: "text-red-400", name: "HTML" },
  css: { icon: FileText, color: "text-blue-500", name: "CSS" },
  json: { icon: FileJson, color: "text-green-500", name: "JSON" },
  default: { icon: File, color: "text-gray-400", name: "File" }
};

export default function CodePlayground() {
  const [files, setFiles] = useState<File[]>([
    { 
      id: uuid(), 
      name: "index.js", 
      language: "javascript", 
      path: "src/index.js",
      content: `// Welcome to VS Code Playground
console.log('Hello, World!');

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}` 
    },
  ]);
  const [activeFile, setActiveFile] = useState<string>(files[0].id);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [sidebarSection, setSidebarSection] = useState("explorer");

  const active = files.find((f) => f.id === activeFile)!;

  const updateFileContent = (value: string | undefined) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFile ? { ...f, content: value || "" } : f))
    );
  };

  const addFile = (language: string = "javascript") => {
    const extensions = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      html: "html",
      css: "css",
      json: "json"
    };
    
    const newFile: File = { 
      id: uuid(), 
      name: `script.${extensions[language as keyof typeof extensions] || "txt"}`,
      language, 
      path: `src/script.${extensions[language as keyof typeof extensions] || "txt"}`,
      content: getDefaultContent(language)
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFile(newFile.id);
  };

  const getDefaultContent = (language: string): string => {
    const defaults = {
      javascript: `// New JavaScript File
console.log('Hello from JavaScript!');

// Your code here
function main() {
  return "Hello World";
}

main();`,
      typescript: `// New TypeScript File
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};

console.log(user);`,
      python: `# New Python File
def main():
    print("Hello from Python!")
    return "Hello World"

if __name__ == "__main__":
    main()`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`,
      css: `/* New CSS File */
body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #1e1e1e;
    color: #ffffff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`,
      json: `{
  "name": "project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`
    };
    return defaults[language as keyof typeof defaults] || "// New file";
  };

  const deleteFile = (fileId: string) => {
    if (files.length === 1) return;
    
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFile === fileId) {
      setActiveFile(files[0].id);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("🔄 Running code...");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(" "));
      
      eval(active.content);
      
      console.log = originalLog;
      setOutput(logs.length > 0 ? logs.join("\n") : "✅ Code executed successfully (no output)");
    } catch (err: any) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getLanguageIcon = (language: string) => {
    const config = languageConfig[language as keyof typeof languageConfig] || languageConfig.default;
    const IconComponent = config.icon;
    return <IconComponent size={16} className={config.color} />;
  };

  const clearOutput = () => {
    setOutput("");
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-[#cccccc] select-none">
      {/* Activity Bar (Leftmost) */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-6">
        <button 
          className={`p-2 rounded ${sidebarSection === "explorer" ? "bg-[#2a2d2e]" : "hover:bg-[#2a2d2e]"}`}
          onClick={() => setSidebarSection("explorer")}
        >
          <FolderOpen size={20} className={sidebarSection === "explorer" ? "text-white" : "text-[#858585]"} />
        </button>
        <button 
          className={`p-2 rounded ${sidebarSection === "search" ? "bg-[#2a2d2e]" : "hover:bg-[#2a2d2e]"}`}
          onClick={() => setSidebarSection("search")}
        >
          <Search size={20} className={sidebarSection === "search" ? "text-white" : "text-[#858585]"} />
        </button>
        <button 
          className={`p-2 rounded ${sidebarSection === "git" ? "bg-[#2a2d2e]" : "hover:bg-[#2a2d2e]"}`}
          onClick={() => setSidebarSection("git")}
        >
          {/* <SourceControl size={20} className={sidebarSection === "git" ? "text-white" : "text-[#858585]"} />
        */}
        </button>
        <button 
          className={`p-2 rounded ${sidebarSection === "settings" ? "bg-[#2a2d2e]" : "hover:bg-[#2a2d2e]"}`}
          onClick={() => setSidebarSection("settings")}
        >
          <Settings size={20} className={sidebarSection === "settings" ? "text-white" : "text-[#858585]"} />
        </button>
      </div>

      {/* Sidebar */}
      {explorerOpen && (
        <div className="w-60 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
          {/* Sidebar Header */}
          <div className="px-4 py-2 text-xs uppercase font-semibold text-[#cccccc] border-b border-[#3e3e42] flex justify-between items-center">
            <span>
              {sidebarSection === "explorer" && "EXPLORER"}
              {sidebarSection === "search" && "SEARCH"}
              {sidebarSection === "git" && "SOURCE CONTROL"}
              {sidebarSection === "settings" && "SETTINGS"}
            </span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-[#3e3e42] rounded">
                <Plus size={14} />
              </button>
              <button 
                className="p-1 hover:bg-[#3e3e42] rounded"
                onClick={() => setExplorerOpen(false)}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 p-2 overflow-y-auto">
            {sidebarSection === "explorer" && (
              <div className="space-y-4">
                {/* Open Editors */}
                <div>
                  <div className="flex items-center gap-1 text-[#cccccc] text-xs uppercase font-semibold mb-1">
                    <ChevronDown size={14} />
                    <span>OPEN EDITORS</span>
                  </div>
                  <div className="space-y-1">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center gap-2 px-2 py-1 rounded text-sm cursor-pointer ${
                          activeFile === file.id 
                            ? "bg-[#37373d]" 
                            : "hover:bg-[#2a2d2e]"
                        }`}
                        onClick={() => setActiveFile(file.id)}
                      >
                        {getLanguageIcon(file.language)}
                        <span className="flex-1 truncate">{file.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.id);
                          }}
                          className="opacity-0 hover:opacity-100 p-1 hover:bg-[#3e3e42] rounded"
                        >
                          <Circle size={8} fill="currentColor" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workspace */}
                <div>
                  <div className="flex items-center gap-1 text-[#cccccc] text-xs uppercase font-semibold mb-1">
                    <ChevronDown size={14} />
                    <span>WORKSPACE</span>
                  </div>
                  <div className="space-y-1 ml-2">
                    <div className="flex items-center gap-1 text-sm text-[#cccccc]">
                      <ChevronDown size={14} />
                      <FolderOpen size={14} className="text-[#dcb67a]" />
                      <span>src</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center gap-2 px-2 py-1 rounded text-sm cursor-pointer ${
                            activeFile === file.id 
                              ? "bg-[#37373d]" 
                              : "hover:bg-[#2a2d2e]"
                          }`}
                          onClick={() => setActiveFile(file.id)}
                        >
                          {getLanguageIcon(file.language)}
                          <span className="flex-1 truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sidebarSection === "search" && (
              <div className="p-4 text-center text-[#858585]">
                <Search size={32} className="mx-auto mb-2" />
                <p className="text-sm">No results found</p>
              </div>
            )}

            {sidebarSection === "git" && (
              <div className="p-4 text-center text-[#858585]">
                {/* <SourceControl size={32} className="mx-auto mb-2" /> */}
                <p className="text-sm">No changes</p>
              </div>
            )}

            {sidebarSection === "settings" && (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Editor</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span>Font Size</span>
                        <span className="text-[#858585]">14px</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Word Wrap</span>
                        <span className="text-[#858585]">on</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="flex items-center bg-[#2d2d2d] border-b border-[#3e3e42]">
          <div className="flex items-center flex-1 overflow-x-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className={`group flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-[#3e3e42] min-w-40 ${
                  activeFile === file.id 
                    ? "bg-[#1e1e1e] text-white border-t-2 border-[#007acc]" 
                    : "hover:bg-[#2a2d2e]"
                }`}
                onClick={() => setActiveFile(file.id)}
              >
                {getLanguageIcon(file.language)}
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3e3e42] rounded"
                >
                  <Circle size={8} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Window Controls */}
          <div className="flex items-center px-4 gap-1">
            <button className="p-1 hover:bg-[#3e3e42] rounded">
              <Minus size={14} />
            </button>
            <button className="p-1 hover:bg-[#3e3e42] rounded">
              <Square size={12} />
            </button>
          </div>
        </div>

        {/* Editor Group */}
        <div className="flex-1 flex">
          {/* Main Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language={active.language}
              value={active.content}
              onChange={updateFileContent}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                fontFamily: "'Cascadia Code', 'Fira Code', 'Courier New', monospace",
                lineHeight: 1.5,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                renderLineHighlight: "all",
                selectionHighlight: true,
                
                matchBrackets: "always",
                bracketPairColorization: { enabled: true },
                guides: { 
                  bracketPairs: true,
                  indentation: true 
                }
              }}
              loading={
                <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007acc] mx-auto mb-2"></div>
                    <p className="text-[#858585]">Loading editor...</p>
                  </div>
                </div>
              }
            />
          </div>

          {/* Output Panel */}
          <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e42]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">PROBLEMS</span>
                <span className="text-xs bg-[#3e3e42] px-2 py-1 rounded-full">0</span>
              </div>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-[#3e3e42] rounded">
                  <Circle size={12} />
                </button>
                <button className="p-1 hover:bg-[#3e3e42] rounded">
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 text-[#858585] text-sm">
              No problems have been detected in the workspace.
            </div>

            {/* Terminal */}
            <div className="flex-1 border-t border-[#3e3e42] flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e42]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">TERMINAL</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-xs ${
                      isRunning 
                        ? "bg-[#3e3e42] cursor-not-allowed" 
                        : "bg-[#0e639c] hover:bg-[#1177bb]"
                    }`}
                  >
                    <Play size={12} fill="currentColor" />
                    Run
                  </button>
                  <button
                    onClick={clearOutput}
                    className="p-1 hover:bg-[#3e3e42] rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black p-4 overflow-y-auto font-mono text-sm">
                <pre className={`whitespace-pre-wrap ${output.includes("❌") ? "text-[#f48771]" : "text-[#89d185]"}`}>
                  {output || "❯ node index.js\nClick Run to execute your code..."}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1 bg-[#007acc] text-white text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              
              <span>main</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle size={8} fill="#f48771" />
              <span>0</span>
              <Circle size={8} fill="#89d185" className="ml-2" />
              <span>0</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln 1, Col 1</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>{active.language}</span>
          </div>
        </div>
      </div>
    </div>
  );
}