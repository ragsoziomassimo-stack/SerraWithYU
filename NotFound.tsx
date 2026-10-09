import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button.tsx";

export default function NotFound() {
  const location = useLocation();
  const { t } = useTranslation("extra");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">{t("nfTitle")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {t("nfText")}
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/">{t("nfHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
