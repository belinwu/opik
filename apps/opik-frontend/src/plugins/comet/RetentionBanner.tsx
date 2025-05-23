import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { useActiveWorkspaceName } from "@/store/AppStore";
import { useObserveResizeNode } from "@/hooks/useObserveResizeNode";
import { QUOTA_TYPE } from "@/plugins/comet/types/quotas";
import useWorkspaceQuotas from "@/plugins/comet/api/useWorkspaceQuotas";
import useUser from "@/plugins/comet/useUser";

import { Button } from "@/components/ui/button";

interface RetentionBannerProps {
  onChangeHeight: (height: number) => void;
}

const SHOW_BANNER_MIN_THRESHOLD = 0.8;

const RetentionBanner = ({ onChangeHeight }: RetentionBannerProps) => {
  const { data: user } = useUser();
  const heightRef = useRef(0);

  const [closed, setClosed] = useState(false);
  const activeWorkspaceName = useActiveWorkspaceName();

  const { data: quotas } = useWorkspaceQuotas(
    { workspaceName: activeWorkspaceName },
    { enabled: !!activeWorkspaceName && !!user },
  );

  const { ref } = useObserveResizeNode<HTMLDivElement>((node) => {
    heightRef.current = node.clientHeight;
    onChangeHeight(node.clientHeight);
  });

  const spanQuota = quotas?.find((q) => q.type === QUOTA_TYPE.OPIK_SPAN_COUNT);

  const isUsedLess80 =
    (spanQuota?.used || 0) / (spanQuota?.limit || 1) <
    SHOW_BANNER_MIN_THRESHOLD;

  const hideBanner = !spanQuota || isUsedLess80 || closed || !user;

  useEffect(() => {
    onChangeHeight(!hideBanner ? heightRef.current : 0);
  }, [hideBanner, onChangeHeight]);

  if (hideBanner) {
    return null;
  }

  const closeBanner = () => {
    setClosed(true);
  };

  const isExceededLimit = spanQuota?.used >= spanQuota?.limit;

  const label = isExceededLimit
    ? "You have exceeded your plan limits. Upgrade to ensure " +
      "uninterrupted monitoring"
    : `You're at 80% of your ${spanQuota?.limit} free spans. Upgrade to ensure ` +
      "uninterrupted monitoring";

  const closable = !isExceededLimit;

  return (
    <div
      className="z-10 box-border flex min-h-12 items-center justify-center bg-primary p-1.5 text-white transition-all"
      ref={ref}
    >
      <div className="flex flex-1 items-center justify-center gap-x-1">
        <span>{label}</span>
        <span className="hidden md:inline">-</span>
        <a
          href="https://www.comet.com/site/about-us/contact-us/"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap underline"
        >
          Contact sales
        </a>
      </div>
      {closable && (
        <Button
          variant="ghost"
          size="icon"
          className="justify-self-end hover:text-white"
          onClick={closeBanner}
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default RetentionBanner;
