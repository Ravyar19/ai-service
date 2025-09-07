import { OrganizationList } from "@clerk/nextjs";

export const OrgSelectView = () => {
  return (
    <OrganizationList
      afterSelectOrganizationUrl="/"
      afterCreateOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
    />
  );
};
