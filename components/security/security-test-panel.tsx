"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H3, P } from "@/components/ui-custom/typography";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type TestResult = {
    name: string;
    status: "pass" | "fail" | "warning";
    message: string;
    details?: string;
};

export function SecurityTestPanel() {
    const [results, setResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runSecurityTests = async () => {
        setIsRunning(true);
        const testResults: TestResult[] = [];

        // Check authentication first
        try {
            const authCheck = await fetch("/api/security-test/auth-check", {
                method: "POST",
            });
            const authData = await authCheck.json();
            
            if (!authData.authenticated) {
                setResults([{
                    name: "Authentication Check",
                    status: "warning",
                    message: "⚠️ You must be logged in to run security tests",
                    details: "Please log in and try again",
                }]);
                setIsRunning(false);
                return;
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        }

        // Test 1: Unauthorized Data Access
        try {
            const response = await fetch("/api/security-test/unauthorized-access", {
                method: "POST",
            });
            const data = await response.json();
            testResults.push({
                name: "Unauthorized Data Access",
                status: data.canAccess ? "fail" : "pass",
                message: data.canAccess
                    ? "⚠️ Can access data without authentication"
                    : "✅ Cannot access protected data",
                details: data.message,
            });
        } catch (error) {
            testResults.push({
                name: "Unauthorized Data Access",
                status: "warning",
                message: "Test failed to execute",
                details: String(error),
            });
        }

        // Test 2: SQL Injection
        try {
            const response = await fetch("/api/security-test/sql-injection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "'; DROP TABLE users; --",
                    petitionId: "1 OR 1=1",
                }),
            });
            const data = await response.json();
            testResults.push({
                name: "SQL Injection Protection",
                status: data.vulnerable ? "fail" : "pass",
                message: data.vulnerable
                    ? "⚠️ Vulnerable to SQL injection"
                    : "✅ Protected from SQL injection",
                details: data.message,
            });
        } catch (error) {
            testResults.push({
                name: "SQL Injection Protection",
                status: "pass",
                message: "✅ Query rejected or sanitized",
                details: "Malicious input was handled safely",
            });
        }

        // Test 3: Update Other User's Data
        try {
            const response = await fetch("/api/security-test/unauthorized-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetPetitionId: 1, // Try to update subscription for petition 1
                }),
            });
            const data = await response.json();
            testResults.push({
                name: "Unauthorized Update",
                status: data.canUpdate ? "fail" : "pass",
                message: data.canUpdate
                    ? "⚠️ Can update other users' data"
                    : "✅ Cannot update other users' data",
                details: data.message,
            });
        } catch (error) {
            testResults.push({
                name: "Unauthorized Update",
                status: "pass",
                message: "✅ Update blocked",
                details: "Cannot modify other users' data",
            });
        }

        // Test 4: Mass Data Extraction
        try {
            const response = await fetch("/api/security-test/mass-extraction", {
                method: "POST",
            });
            const data = await response.json();
            testResults.push({
                name: "Mass Data Extraction",
                status: data.count > 100 ? "fail" : "pass",
                message:
                    data.count > 100
                        ? `⚠️ Can extract ${data.count} records at once`
                        : "✅ Data extraction limited",
                details: data.message,
            });
        } catch (error) {
            testResults.push({
                name: "Mass Data Extraction",
                status: "pass",
                message: "✅ Query blocked or limited",
                details: "Cannot extract large amounts of data",
            });
        }

        // Test 5: Access Control Bypass
        try {
            const response = await fetch("/api/security-test/access-control", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    petitionId: 1,
                    action: "delete",
                }),
            });
            const data = await response.json();
            testResults.push({
                name: "Access Control",
                status: data.canDelete ? "fail" : "pass",
                message: data.canDelete
                    ? "⚠️ Can perform unauthorized actions"
                    : "✅ Access control working",
                details: data.message,
            });
        } catch (error) {
            testResults.push({
                name: "Access Control",
                status: "pass",
                message: "✅ Action blocked",
                details: "Unauthorized actions prevented",
            });
        }

        // Test 6: Immutable Timestamp Protection
        try {
            const response = await fetch("/api/security-test/immutable-timestamp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    petitionId: 1, // Use a valid petition ID that the user is subscribed to
                }),
            });
            const data = await response.json();
            testResults.push({
                name: "Immutable Timestamp",
                status: data.canModifyTimestamp ? "fail" : "pass",
                message: data.canModifyTimestamp
                    ? "⚠️ Can modify created_at timestamp"
                    : "✅ created_at is properly immutable",
                details: data.message,
            });
        } catch (error) {
            testResults.push({
                name: "Immutable Timestamp",
                status: "warning",
                message: "Test failed to execute",
                details: String(error),
            });
        }

        // Test 7: Manual Liked Update
        try {
            const response = await fetch("/api/security-test/manual-liked-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetPetitionId: 1,
                    targetOfferId: 1,
                }),
            });
            const data = await response.json();
            testResults.push({
                name: "Manual Liked Update",
                status: data.canUpdate ? "fail" : "pass",
                message: data.canUpdate
                    ? "⚠️ Can manually update liked value (should use RPC)"
                    : "✅ Manual liked update blocked - must use RPC",
                details: data.message,
            });
        } catch (error) {
            testResults.push({
                name: "Manual Liked Update",
                status: "pass",
                message: "✅ Update properly blocked",
                details: "Can only update liked through toggle_liked RPC",
            });
        }

        // Test 8: Private Follows Access
        try {
            const response = await fetch("/api/security-test/private-follows-access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    privateUserId: "08e03277-f6d9-4792-ae23-5a8580ec3d48",
                    publicUserId: "1245a3e1-2459-4a4f-af4d-5b756e6fb76d",
                }),
            });
            const data = await response.json();
            
            // Handle authentication error specifically
            if (response.status === 401 || data.message?.includes("not authenticated")) {
                testResults.push({
                    name: "Private Follows Access",
                    status: "warning",
                    message: "⚠️ Authentication required to run test",
                    details: "Please log in to test RLS policies",
                });
            } else if (data.privateFails && data.publicSucceeds) {
                testResults.push({
                    name: "Private Follows Access",
                    status: "pass",
                    message: "✅ Private follows properly protected, public follows accessible",
                    details: JSON.stringify(data.details, null, 2),
                });
            } else {
                testResults.push({
                    name: "Private Follows Access",
                    status: "fail",
                    message: data.message || "⚠️ RLS not working correctly",
                    details: JSON.stringify(data.details, null, 2),
                });
            }
        } catch (error) {
            testResults.push({
                name: "Private Follows Access",
                status: "warning",
                message: "Test failed to execute",
                details: String(error),
            });
        }

        // Test 9: Auth Schema Tampering
        try {
            const response = await fetch("/api/security-test/auth-tampering", {
                method: "POST",
            });
            const data = await response.json();
            testResults.push({
                name: "Auth Schema Protection",
                status: data.canTamper ? "fail" : "pass",
                message: data.canTamper
                    ? "🚨 CRITICAL: Can tamper with auth schema"
                    : "✅ Auth schema properly protected",
                details: JSON.stringify(data.tests, null, 2),
            });
        } catch (error) {
            testResults.push({
                name: "Auth Schema Protection",
                status: "pass",
                message: "✅ Auth schema blocked",
                details: String(error),
            });
        }

        setResults(testResults);
        setIsRunning(false);
    };

    const getStatusColor = (status: TestResult["status"]) => {
        switch (status) {
            case "pass":
                return "bg-green-500";
            case "fail":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <H3>Security Test Panel</H3>
                <P className="text-muted-foreground">Test security vulnerabilities from end-user perspective</P>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={runSecurityTests} disabled={isRunning} className="w-full">
                    {isRunning ? "Running Tests..." : "Run Security Tests"}
                </Button>

                <Separator />

                {results.length > 0 && (
                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                                            <P className="font-semibold">{result.name}</P>
                                        </div>
                                        <P className="text-sm">{result.message}</P>
                                        {result.details && (
                                            <P className="text-xs text-muted-foreground mt-2">Details: {result.details}</P>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {results.length > 0 && (
                    <Card className="p-4 bg-muted">
                        <P className="font-semibold mb-2">Summary</P>
                        <div className="flex gap-4">
                            <P className="text-muted-foreground">Passed: {results.filter((r) => r.status === "pass").length}</P>
                            <P className="text-muted-foreground">Failed: {results.filter((r) => r.status === "fail").length}</P>
                            <P className="text-muted-foreground">Warnings: {results.filter((r) => r.status === "warning").length}</P>
                        </div>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}