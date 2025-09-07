import { ArrowLeftRightIcon, type LucideIcon, PlugIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PluginCardProps {
  isDisabled?: boolean;
  serviceName: string;
  serviceImage: string;
  features: Feature[];
  onSubmit: () => void;
}

export const PluginCard = ({
  isDisabled,
  serviceName,
  serviceImage,
  features,
  onSubmit,
}: PluginCardProps) => {
  return (
    <div className="h-fit w-full rounded-lg border bg-background p-8">
      <div className="mb-6 flex items-center gap-6 justify-center">
        <div className="flex flex-col items-center">
          <Image
            src={serviceImage}
            alt={serviceName}
            width={40}
            height={40}
            className="rounded object-contain"
          />
        </div>
        <ArrowLeftRightIcon className="size-6" />
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="platform"
            width={40}
            height={40}
            className="rounded object-contain"
          />
        </div>
      </div>
      <div className="mb-6 text-center">
        <p className="text-lg">Connect your {serviceName} account to start</p>
      </div>
      <div className="mb-6">
        <div className="space-y-4">
          {features.map((feature) => (
            <div className="flex items-center gap-3" key={feature.title}>
              <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                <feature.icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium text-sm">{feature.title}</div>
                <div className="text-muted-foreground text-xs ">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center ">
        <Button
          onClick={onSubmit}
          className="size-full "
          disabled={isDisabled}
          variant="default"
        >
          Connect {serviceName}
          <PlugIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
