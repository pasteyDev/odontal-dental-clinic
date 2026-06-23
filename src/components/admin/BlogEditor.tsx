import React, { useEffect, useState } from "react";

export default function BlogEditor(props: { initial?: any; onSaved?: () => void }) {
  const [Client, setClient] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    import("./BlogEditor.client").then((m) => {
      if (mounted) setClient(() => m.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Client) return <div>Loading editor…</div>;
  return <Client {...props} />;
}
