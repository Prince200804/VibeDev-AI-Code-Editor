"use client";

import { X, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

interface AIAssistantDialogProps {
  onClose: () => void;
  currentCode: string;
  language: string;
}

export default function AIAssistantDialog({ onClose, currentCode, language }: AIAssistantDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getAIAssistance = useAction(api.aiAssistant.getAIAssistance);
  const { editor } = useCodeEditorStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await getAIAssistance({
        userPrompt: prompt,
        currentCode,
        language,
      });

      if (result.success && result.code) {
        // Update the editor with AI-generated code
        if (editor) {
          editor.setValue(result.code);
          localStorage.setItem(`editor-code-${language}`, result.code);
        }
        onClose();
      } else {
        alert(result.error || "Failed to get AI assistance");
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      alert("Failed to get AI assistance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AI Coding Assistant</h2>
                <p className="text-sm text-gray-400">Powered by Gemini AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What would you like AI to do?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Fix the syntax error in this code, or write a function to sort an array..."
                  className="w-full h-32 px-4 py-3 bg-[#12121a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI will analyze your {language} code and provide assistance</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 
                  text-white font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 
                  disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get AI Help
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
