"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiPhoneNumbers } from "../../hooks/use-vapi-data";
import { toast } from "sonner";
import {
  Check,
  CheckCircleIcon,
  CopyIcon,
  LoaderIcon,
  PhoneIcon,
  XCircleIcon,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

export const VapiPhoneNumbersTab = () => {
  const { data: PhoneNumbers, isLoading } = useVapiPhoneNumbers();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="border-t bg-background ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Phone Number</TableHead>
            <TableHead className="px-6 py-4">Name</TableHead>
            <TableHead className="px-6 py-4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading phone numbers...
                  </TableCell>
                </TableRow>
              );
            }
            if (PhoneNumbers.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No phone numbers configured
                  </TableCell>
                </TableRow>
              );
            }
            return PhoneNumbers.map((phone) => (
              <TableRow key={phone.id} className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span>{phone.number || "Not configured"}</span>
                    {phone.number && (
                      <button
                        onClick={() => copyToClipboard(phone.number!)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <CopyIcon className="size-4" />
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span>{phone.name || "Unnamed"}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {(() => {
                    switch (phone.status) {
                      case "active":
                        return (
                          <Badge className="flex items-center gap-1.5">
                            <CheckCircleIcon className="size-3" />
                            <span className="capitalize">{phone.status}</span>
                          </Badge>
                        );
                      case "activating":
                        return (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1.5"
                          >
                            <LoaderIcon className="size-3 animate-spin" />
                            <span className="capitalize">{phone.status}</span>
                          </Badge>
                        );
                      default:
                        return (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1.5"
                          >
                            <XCircleIcon className="size-3" />
                            <span className="capitalize">
                              {phone.status || "Unknown"}
                            </span>
                          </Badge>
                        );
                    }
                  })()}
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
