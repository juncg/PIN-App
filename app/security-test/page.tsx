import { SecurityTestPanel } from "@/components/security/security-test-panel";
import { B1, H1 } from "@/components/ui-custom/typography";
import { redirect } from "next/navigation";

export default function SecurityTestPage() {
	if (process.env.NEXT_PUBLIC_DEBUG_MODE !== "true") {
		redirect("/home");
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			<div className="text-center space-y-2">
				<H1>Security Vulnerability Testing</H1>
				<B1 className="text-lightgrey">Test common security vulnerabilities from end-user perspective</B1>
			</div>

			<SecurityTestPanel />

			<div className="max-w-4xl mx-auto space-y-4 text-sm text-lightgrey">
				<B1 className="font-semibold">What This Tests:</B1>
				<ul className="list-disc list-inside space-y-2">
					<li>Row Level Security (RLS) - Can users access data they shouldn't?</li>
					<li>SQL Injection - Are inputs properly sanitized?</li>
					<li>Unauthorized Updates - Can users modify others' data?</li>
					<li>Mass Data Extraction - Can users extract large amounts of data?</li>
					<li>Access Control - Can users perform unauthorized actions?</li>
				</ul>

				<B1 className="font-semibold mt-4">⚠️ Important Notes:</B1>
				<ul className="list-disc list-inside space-y-2">
					<li>This should ONLY be run in development/staging environments</li>
					<li>All tests use the app's service layer (GetClient) - testing real user access</li>
					<li>
						Failed tests (red) indicate vulnerabilities that need immediate attention in Supabase RLS
						policies
					</li>
					<li>Run these tests logged in AND logged out to test both scenarios</li>
				</ul>
			</div>
		</div>
	);
}
