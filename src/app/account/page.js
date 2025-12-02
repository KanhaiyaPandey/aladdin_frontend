import AccountPageClient from "./AccountPageClient";
import ProtectedAccountPage from "./ProtectedAccountPage";

export default async function AccountPage() {
  return (
    <div className="w-full flex items-center justify-center">
      <ProtectedAccountPage />
    </div>
  );
}
