import * as React from "react";

type Props = {
  children: (R: any) => React.ReactNode;
  fallback?: React.ReactNode;
};

export default function LazyRecharts({ children, fallback = null }: Props) {
  const [R, setR] = React.useState<any>(null);

  React.useEffect(() => {
    let mounted = true;
    import("recharts")
      .then((mod) => {
        if (mounted) setR(mod);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!R)
    return <>{fallback ?? <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">Loading chart…</div>}</>;

  return <>{children(R)}</>;
}
