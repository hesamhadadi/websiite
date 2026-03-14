import { Suspense } from "react";
import AuthContent from "./AuthContent";

export default function AdminAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs text-text-secondary tracking-widest animate-pulse">LOADING...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
