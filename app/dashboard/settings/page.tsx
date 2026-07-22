"use client";

import { useState } from "react";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { SettingsProfileForm } from "@/components/settings/SettingsProfileForm";
import { SettingsBisnisForm } from "@/components/settings/SettingsBisnisForm";
import { SettingsIntegrasiPanel } from "@/components/settings/SettingsIntegrasiPanel";
import { SettingsNotifPanel } from "@/components/settings/SettingsNotifPanel";
import { SettingsSecurityPanel } from "@/components/settings/SettingsSecurityPanel";
import { SettingsSubscriptionPanel } from "@/components/settings/SettingsSubscriptionPanel";
import type { SettingsTab } from "@/components/settings/SettingsNav";

function SettingsContent({ tab }: { tab: SettingsTab }) {
    switch (tab) {
        case "profil":
            return <SettingsProfileForm />;
        case "bisnis":
            return <SettingsBisnisForm />;
        case "integrasi":
            return <SettingsIntegrasiPanel />;
        case "notifikasi":
            return <SettingsNotifPanel />;
        case "keamanan":
            return <SettingsSecurityPanel />;
        case "langganan":
            return <SettingsSubscriptionPanel />;
    }
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profil");

    return (
        <>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-buddy-text-main">Pengaturan</h1>
                <p className="text-sm text-buddy-text-muted">
                    Kelola akun, bisnis, dan preferensi Anda
                </p>
            </div>

            {/* 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Nav */}
                <div className="lg:col-span-3">
                    <SettingsNav active={activeTab} onChange={setActiveTab} />
                </div>

                {/* Content */}
                <div className="lg:col-span-9">
                    <SettingsContent tab={activeTab} />
                </div>
            </div>
        </>
    );
}
