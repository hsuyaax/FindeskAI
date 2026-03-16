"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle, Loader2, AlertTriangle, X, Sparkles } from "lucide-react";

interface UploadSectionProps {
  onAnalysisComplete: (data: Record<string, unknown>) => void;
  onPipelineStep: (step: number, status: string) => void;
}

export default function UploadSection({ onAnalysisComplete, onPipelineStep }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
    setError("");
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setError("");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const analyzeDocuments = async () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    setError("");

    try {
      setProgress("Uploading documents & running OCR...");
      onPipelineStep(0, "processing");

      const formData = new FormData();
      formData.append("file", files[0]);

      setProgress("AI analyzing financial data...");
      onPipelineStep(1, "processing");

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data = await res.json();

      const steps = [
        { i: 2, msg: "Running three-way reconciliation..." },
        { i: 3, msg: "GST forensics & fraud detection..." },
        { i: 4, msg: "External research (MCA, CIBIL, e-Courts)..." },
        { i: 5, msg: "Benford's Law statistical analysis..." },
      ];

      for (const step of steps) {
        setProgress(step.msg);
        onPipelineStep(step.i, "processing");
        await new Promise((r) => setTimeout(r, 600));
        onPipelineStep(step.i, "done");
      }

      setProgress("Credit committee AI debate...");
      onPipelineStep(6, "done");
      await new Promise((r) => setTimeout(r, 400));

      setProgress("Compliance check & CAM generation...");
      onPipelineStep(7, "done");
      onPipelineStep(8, "done");

      setCompleted(true);
      setProgress("Analysis complete!");
      onAnalysisComplete(data.analysis || data);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (completed) {
    return (
      <div className="p-4 flex items-center gap-3" style={{ background: "white", border: "2px solid #00CC66", boxShadow: "2px 2px 0px #111" }}>
        <CheckCircle size={20} color="#00CC66" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-[#00CC66]">
            AI Analysis Complete
          </div>
          <div className="text-[11px] text-[#555]">
            {files.map((f) => f.name).join(", ")} -- processed by OpenAI
          </div>
        </div>
        <button
          onClick={() => {
            setCompleted(false);
            setFiles([]);
          }}
          className="text-[11px] text-[#888] cursor-pointer bg-transparent px-3 py-1.5 transition-all"
          style={{ border: "2px solid #111" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F4F4F0"; e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Upload New
        </button>
      </div>
    );
  }

  return (
    <div className="p-5" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} color="#6633FF" />
        <span className="text-sm font-bold text-[#111]">
          AI Document Analysis
        </span>
        <span className="text-[9px] text-[#888] px-2 py-0.5 font-mono uppercase" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          Powered by OpenAI
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed p-6 text-center cursor-pointer transition-all"
        style={{
          borderColor: isDragging ? "#0033FF" : "#ddd",
          background: isDragging ? "#F0F0FF" : "transparent",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload
          size={28}
          className="mx-auto mb-2"
          color={isDragging ? "#0033FF" : "#aaa"}
        />
        <p className="text-xs text-[#555]">
          Drop financial documents here or click to browse
        </p>
        <p className="text-[10px] text-[#aaa] mt-1">
          PDF, Images, Excel -- Annual Reports, GST Returns, Bank Statements
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: "#F4F4F0", border: "1px solid #ddd" }}
            >
              <FileText size={14} color="#0033FF" />
              <span className="text-[11px] text-[#111] flex-1 truncate">
                {file.name}
              </span>
              <span className="text-[10px] text-[#888]">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              {!isAnalyzing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="cursor-pointer bg-transparent border-none p-0.5"
                >
                  <X size={12} color="#888" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analyze button */}
      {files.length > 0 && (
        <button
          onClick={analyzeDocuments}
          disabled={isAnalyzing}
          className="mt-3 w-full py-2.5 text-xs font-semibold cursor-pointer border-none transition-all flex items-center justify-center gap-2"
          style={{
            background: isAnalyzing ? "#F4F4F0" : "#0033FF",
            color: isAnalyzing ? "#555" : "#FFFFFF",
            border: isAnalyzing ? "2px solid #ddd" : "2px solid #0033FF",
            boxShadow: isAnalyzing ? "none" : "3px 3px 0px #111",
          }}
          onMouseEnter={(e) => { if (!isAnalyzing) { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = isAnalyzing ? "none" : "3px 3px 0px #111"; }}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {progress}
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Analyze with AI
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3" style={{ background: "#FFF0F3", border: "2px solid #FF3366" }}>
          <AlertTriangle size={14} color="#FF3366" />
          <span className="text-[11px] text-[#CC0044]">{error}</span>
        </div>
      )}
    </div>
  );
}
