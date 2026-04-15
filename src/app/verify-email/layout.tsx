import { Suspense } from "react";

export default function verifyLayout({ children } : { children: React.ReactNode }) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        
        <main>{children}</main>
      </Suspense>
    </div>
  );
}