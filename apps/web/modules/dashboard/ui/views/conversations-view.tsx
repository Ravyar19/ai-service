import Image from "next/image";

export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2 flex-col">
        <Image src="/logo.svg" alt="LOGO" width={40} height={40} />
        <p className="font-semibold text-lg">Service AI</p>
        <p>Please select a conversation from the inbox</p>
      </div>
    </div>
  );
};
