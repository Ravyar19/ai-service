"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";

import { WidgetHeader } from "../components/widget-header";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);

  //validate org
  const validateOrganization = useAction(api.public.organizations.validate);
  useEffect(() => {
    if (step !== "org") return;

    setLoadingMessage("Finding organization ID...");

    if (!organizationId) {
      setErrorMessage("Organization ID is required");
      setScreen("error");
      return;
    }
    setLoadingMessage("Verifying organization...");
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid configuration");
          setScreen("error");
        }
      })
      .catch((error) => {
        setErrorMessage("Unable to verify organization");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    validateOrganization,
    setOrganizationId,
    setStep,
    setLoadingMessage,
  ]);

  // validate session
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );
  useEffect(() => {
    if (step !== "session") return;
    setLoadingMessage("Finding contact session ID...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("settings");
      return;
    }
    setLoadingMessage("Validating session...");
    validateContactSession({
      contactSessionId,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("settings");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("settings");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    validateContactSession,
    setSessionValid,
    setStep,
  ]);

  // load widget settings

  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId
      ? {
          organizationId,
        }
      : "skip"
  );

  useEffect(() => {
    if (step !== "settings") {
      return;
    }
    setLoadingMessage("Loading widget settings...");
    if (widgetSettings !== undefined && organizationId) {
      setWidgetSettings(widgetSettings);
      setStep("done");
    }
  }, [widgetSettings, setWidgetSettings, step, setLoadingMessage, setStep]);

  useEffect(() => {
    if (step !== "done") return;
    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-xl font-semibold text-white">I</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Hi There 👋</h1>
            <p className="text-base text-white/90">Let's get you started</p>
          </div>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="h-10 w-10 animate-spin " />
        <p className="">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
};
